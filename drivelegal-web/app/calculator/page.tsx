"use client";

import { useEffect, useMemo, useState } from "react";
import {
  postChallan, getViolations,
  type ChallanResponse, type ViolationEntry,
} from "@/lib/api";
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

const VEHICLES = [
  { v: "all", en: "Any", hi: "कोई भी" },
  { v: "two_wheeler", en: "Two-wheeler", hi: "दोपहिया" },
  { v: "car", en: "Car", hi: "कार" },
  { v: "commercial", en: "Commercial", hi: "वाणिज्यिक" },
];

export default function CalculatorPage() {
  const { lang } = useLang();
  const [country, setCountry] = useState("IN");
  const [state, setState] = useState<string>("Maharashtra");
  const [vehicle, setVehicle] = useState("all");
  const [isRepeat, setIsRepeat] = useState(false);
  const [violations, setViolations] = useState<ViolationEntry[]>([]);
  const [violationCode, setViolationCode] = useState<string>("");
  const [loadingVs, setLoadingVs] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<ChallanResponse | null>(null);

  const stateOptions = STATES[country] ?? [];

  useEffect(() => {
    if (!stateOptions.includes(state)) {
      setState(stateOptions[0] ?? "");
    }
  }, [country]); // eslint-disable-line

  useEffect(() => {
    let cancelled = false;
    setLoadingVs(true);
    setErr(null);
    getViolations(country, state || undefined)
      .then((r) => {
        if (cancelled) return;
        const dedup = new Map<string, ViolationEntry>();
        for (const v of r.violations) {
          if (!dedup.has(v.violation_code)) dedup.set(v.violation_code, v);
        }
        const list = [...dedup.values()];
        setViolations(list);
        if (list.length && !list.find((v) => v.violation_code === violationCode)) {
          setViolationCode(list[0].violation_code);
        }
      })
      .catch((e) => !cancelled && setErr(e.message ?? "Failed to load violations"))
      .finally(() => !cancelled && setLoadingVs(false));
    return () => { cancelled = true; };
  }, [country, state]); // eslint-disable-line

  const locationLabel = useMemo(() => {
    if (state) return state;
    return COUNTRIES.find((c) => c.code === country)?.label ?? country;
  }, [country, state]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!violationCode) return;
    setBusy(true);
    setErr(null);
    setResult(null);
    try {
      const r = await postChallan({
        location: locationLabel,
        violation: violationCode,
        vehicle_type: vehicle,
        is_repeat: isRepeat,
        language: lang,
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
        <h1 className="font-serif text-3xl">{t("navCalc", lang)}</h1>
        <p className="text-ink-muted text-sm">
          {lang === "hi"
            ? "स्थान, वाहन और उल्लंघन चुनें — सटीक जुर्माना देखें।"
            : "Pick a location, vehicle and violation — get the exact fine."}
        </p>
      </header>

      <Card>
        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>{t("country", lang)}</Label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={inputCls}
            >
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.label}</option>
              ))}
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
              {stateOptions.length === 0 ? (
                <option value="">—</option>
              ) : (
                stateOptions.map((s) => <option key={s} value={s}>{s}</option>)
              )}
            </select>
          </div>

          <div>
            <Label>{t("violation", lang)}</Label>
            <select
              value={violationCode}
              onChange={(e) => setViolationCode(e.target.value)}
              className={inputCls}
              disabled={loadingVs || violations.length === 0}
            >
              {loadingVs && <option>{t("loading", lang)}</option>}
              {!loadingVs && violations.length === 0 && (
                <option value="">{t("noData", lang)}</option>
              )}
              {!loadingVs && violations.map((v) => (
                <option key={v.violation_code} value={v.violation_code}>
                  {v.violation_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label>{t("vehicle", lang)}</Label>
            <select
              value={vehicle}
              onChange={(e) => setVehicle(e.target.value)}
              className={inputCls}
            >
              {VEHICLES.map((v) => (
                <option key={v.v} value={v.v}>{lang === "hi" ? v.hi : v.en}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2 flex items-center justify-between flex-wrap gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-ink-muted">
              <input
                type="checkbox"
                checked={isRepeat}
                onChange={(e) => setIsRepeat(e.target.checked)}
                className="h-4 w-4 rounded border-line"
              />
              {t("repeat", lang)}
            </label>
            <Button type="submit" disabled={busy || !violationCode}>
              {busy ? <Spinner /> : t("calculate", lang)}
            </Button>
          </div>
        </form>
      </Card>

      {err && <ErrorBox title={t("errorTitle", lang)} message={err} />}

      {result && <ResultCard r={result} lang={lang} />}
    </div>
  );
}

function ResultCard({ r, lang }: { r: ChallanResponse; lang: "en" | "hi" }) {
  const fmt = (n: number) => new Intl.NumberFormat().format(n);
  const sevTone =
    r.severity === "criminal" ? "bad" : r.severity === "serious" ? "warn" : "neutral";
  const sevLabel = lang === "hi"
    ? r.severity === "criminal" ? "आपराधिक" : r.severity === "serious" ? "गंभीर" : "मामूली"
    : r.severity.charAt(0).toUpperCase() + r.severity.slice(1);

  return (
    <Card className="space-y-5">
      {r.__offline && (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          {lang === "hi" ? "ऑफलाइन मोड — डेटा थोड़ा पुराना हो सकता है" : "Offline mode — data may be slightly stale"}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone={r.compoundable ? "good" : "bad"}>
          {r.compoundable ? t("compoundable", lang) : t("nonCompoundable", lang)}
        </Badge>
        <Badge tone={sevTone as "bad" | "warn" | "neutral"}>{sevLabel}</Badge>
        {r.section_reference && (
          <Badge tone="neutral">§ {r.section_reference}</Badge>
        )}
        {r.suspension_days > 0 && (
          <Badge tone="warn">
            {lang === "hi"
              ? `${r.suspension_days} दिन निलंबन`
              : `${r.suspension_days}-day suspension`}
          </Badge>
        )}
      </div>

      <div>
        <div className="font-serif text-xl">{r.violation_name}</div>
        <div className="text-sm text-ink-muted">
          {[r.location.state, r.location.country].filter(Boolean).join(" · ")} ·{" "}
          {r.vehicle_type}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <div className="rounded-lg bg-paper border border-line p-4">
          <div className="text-xs uppercase tracking-wide text-ink-muted">
            {t("fineFirst", lang)}
          </div>
          <div className="font-serif text-4xl mt-1">
            {r.currency} {fmt(r.fine_first)}
          </div>
        </div>
        {r.fine_repeat != null && (
          <div className="rounded-lg bg-paper border border-line p-4">
            <div className="text-xs uppercase tracking-wide text-ink-muted">
              {t("fineRepeat", lang)}
            </div>
            <div className="font-serif text-4xl mt-1">
              {r.currency} {fmt(r.fine_repeat)}
            </div>
          </div>
        )}
      </div>

      <p className="text-sm leading-relaxed text-ink">{r.summary}</p>

      {r.how_to_pay && (
        <a
          href={r.how_to_pay}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-accent hover:underline"
        >
          {t("payNow", lang)} →
        </a>
      )}
    </Card>
  );
}
