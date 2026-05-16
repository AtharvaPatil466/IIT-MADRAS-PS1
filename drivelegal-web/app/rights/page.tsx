"use client";

import { useEffect, useState } from "react";
import { getRights, type RightsResponse } from "@/lib/api";
import { useLang } from "@/components/LangContext";
import { t } from "@/lib/i18n";
import { Button, Card, ErrorBox, Label, Spinner, inputCls } from "@/components/ui";

const QUICK = ["Mumbai", "Delhi", "Bengaluru", "Chennai", "London", "Dubai", "California"];

export default function RightsPage() {
  const { lang } = useLang();
  const [loc, setLoc] = useState("Mumbai");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<RightsResponse | null>(null);

  async function load(target?: string) {
    const q = (target ?? loc).trim();
    if (!q) return;
    setBusy(true); setErr(null);
    try {
      const r = await getRights(q);
      setData(r);
    } catch (e: unknown) {
      setData(null);
      setErr(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { load("Mumbai"); }, []); // eslint-disable-line

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl">{t("navRights", lang)}</h1>
        <p className="text-ink-muted text-sm">
          {lang === "hi"
            ? "अपने इलाके के अधिकार और सही प्रक्रिया जानें।"
            : "Know what's required, what police can ask, and how to dispute."}
        </p>
      </header>

      <Card>
        <form
          onSubmit={(e) => { e.preventDefault(); load(); }}
          className="flex flex-col sm:flex-row gap-3 sm:items-end"
        >
          <div className="flex-1">
            <Label>{t("location", lang)}</Label>
            <input
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              placeholder={t("placeholderLocation", lang)}
              className={inputCls}
            />
          </div>
          <Button type="submit" disabled={busy || !loc.trim()}>
            {busy ? <Spinner /> : (lang === "hi" ? "देखें" : "Look up")}
          </Button>
        </form>
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK.map((q) => (
            <button
              key={q}
              onClick={() => { setLoc(q); load(q); }}
              className="text-xs rounded-md border border-line px-2.5 py-1 hover:border-ink/30"
            >
              {q}
            </button>
          ))}
        </div>
      </Card>

      {err && <ErrorBox title={t("errorTitle", lang)} message={err} />}

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Card>
            <h2 className="font-serif text-lg mb-3">{t("documents", lang)}</h2>
            <ul className="space-y-1.5 text-sm">
              {data.documents_required.map((d) => (
                <li key={d} className="flex gap-2"><span className="text-accent">·</span>{d}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="font-serif text-lg mb-3">{t("canDemand", lang)}</h2>
            <ul className="space-y-1.5 text-sm">
              {data.cop_can_demand.map((d) => (
                <li key={d} className="flex gap-2 text-ink"><span className="text-emerald-700">✓</span>{d}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="font-serif text-lg mb-3">{t("cannotDemand", lang)}</h2>
            <ul className="space-y-1.5 text-sm">
              {data.cop_cannot_demand.map((d) => (
                <li key={d} className="flex gap-2 text-ink"><span className="text-rose-700">✗</span>{d}</li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="font-serif text-lg mb-3">{t("disputeProcess", lang)}</h2>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{data.dispute_process}</p>
            {data.payment_portal_url && (
              <a
                href={data.payment_portal_url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm text-accent hover:underline"
              >
                {t("payNow", lang)} →
              </a>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}
