"use client";

import { useEffect, useState } from "react";
import { getViolations, postVerify, type VerifyResponse, type ViolationEntry } from "@/lib/api";
import { useLang } from "@/components/LangContext";
import { t } from "@/lib/i18n";
import { Badge, Button, Card, ErrorBox, Label, Spinner, inputCls } from "@/components/ui";

const COUNTRIES = [
  { code: "IN", label: "India" },
  { code: "UK", label: "United Kingdom" },
  { code: "AE", label: "United Arab Emirates" },
  { code: "US", label: "United States" },
];

const STATES: Record<string, string[]> = {
  IN: ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat"],
  UK: [],
  AE: ["Dubai", "Abu Dhabi", "Sharjah"],
  US: ["California", "New York", "Texas", "Florida"],
};

const VEHICLES = ["all", "two_wheeler", "car", "commercial"];

export default function VerifyPage() {
  const { lang } = useLang();
  const [country, setCountry] = useState("IN");
  const [state, setState] = useState("Maharashtra");
  const [vehicle, setVehicle] = useState("all");
  const [amount, setAmount] = useState<string>("2000");
  const [violations, setViolations] = useState<ViolationEntry[]>([]);
  const [violationCode, setViolationCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<VerifyResponse | null>(null);

  const stateOptions = STATES[country] ?? [];

  useEffect(() => {
    if (!stateOptions.includes(state)) setState(stateOptions[0] ?? "");
  }, [country]); // eslint-disable-line

  useEffect(() => {
    let cancelled = false;
    getViolations(country, state || undefined).then((r) => {
      if (cancelled) return;
      const seen = new Set<string>();
      const list = r.violations.filter((v) => {
        if (seen.has(v.violation_code)) return false;
        seen.add(v.violation_code);
        return true;
      });
      setViolations(list);
      if (list.length && !list.find((v) => v.violation_code === violationCode)) {
        setViolationCode(list[0].violation_code);
      }
    }).catch((e) => !cancelled && setErr(e.message));
    return () => { cancelled = true; };
  }, [country, state]); // eslint-disable-line

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!violationCode) return;
    setBusy(true); setErr(null); setResult(null);
    try {
      const r = await postVerify({
        location: state || COUNTRIES.find((c) => c.code === country)!.label,
        violation: violationCode,
        vehicle_type: vehicle,
        amount_told: Number(amount),
      });
      setResult(r);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl">{t("navVerify", lang)}</h1>
        <p className="text-ink-muted text-sm">
          {lang === "hi"
            ? "क्या आपसे अधिक वसूला जा रहा है? चेक करें।"
            : "Are you being overcharged? Check the official amount."}
        </p>
      </header>

      <Card>
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>{t("country", lang)}</Label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className={inputCls}>
              {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <Label>{t("state", lang)}</Label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className={inputCls}
              disabled={stateOptions.length === 0}
            >
              {stateOptions.length === 0 ? <option value="">—</option> :
                stateOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <Label>{t("violation", lang)}</Label>
            <select
              value={violationCode}
              onChange={(e) => setViolationCode(e.target.value)}
              className={inputCls}
              disabled={violations.length === 0}
            >
              {violations.map((v) => (
                <option key={v.violation_code} value={v.violation_code}>{v.violation_name}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>{t("vehicle", lang)}</Label>
            <select value={vehicle} onChange={(e) => setVehicle(e.target.value)} className={inputCls}>
              {VEHICLES.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <Label>{t("amountTold", lang)}</Label>
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputCls}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={busy || !violationCode || amount === ""}>
              {busy ? <Spinner /> : t("check", lang)}
            </Button>
          </div>
        </form>
      </Card>

      {err && <ErrorBox title={t("errorTitle", lang)} message={err} />}

      {result && <VerdictCard r={result} lang={lang} />}
    </div>
  );
}

function VerdictCard({ r, lang }: { r: VerifyResponse; lang: "en" | "hi" }) {
  const fmt = (n: number | null | undefined) =>
    n == null ? "—" : new Intl.NumberFormat().format(n);
  const tone =
    r.verdict === "correct" ? "good" :
    r.verdict === "overcharged" ? "bad" :
    r.verdict === "undercharged" ? "warn" : "neutral";
  const label =
    r.verdict === "correct" ? t("correct", lang) :
    r.verdict === "overcharged" ? t("overcharged", lang) :
    r.verdict === "undercharged" ? t("undercharged", lang) : t("unknown", lang);

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-3">
        <Badge tone={tone}>{label.toUpperCase()}</Badge>
        {r.verdict === "overcharged" && (
          <span className="text-sm text-rose-800">
            {lang === "hi" ? "आपसे अधिक माँगा जा रहा है" : "You are being overcharged."}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <Cell label={t("amountTold", lang)} value={`${r.currency} ${fmt(r.amount_told)}`} />
        <Cell label={t("actual", lang)} value={`${r.currency} ${fmt(r.actual_amount)}`} accent />
        <Cell label={t("difference", lang)} value={`${r.currency} ${fmt(r.difference)}`} />
      </div>
      <p className="text-sm leading-relaxed">{r.explanation}</p>
    </Card>
  );
}

function Cell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-lg border border-line bg-paper p-3">
      <div className="text-[10px] uppercase tracking-wide text-ink-muted">{label}</div>
      <div className={"mt-1 font-serif " + (accent ? "text-2xl" : "text-xl")}>{value}</div>
    </div>
  );
}
