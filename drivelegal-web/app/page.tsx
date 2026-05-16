"use client";

import { useEffect, useRef, useState } from "react";
import { postQuery, type Citation } from "@/lib/api";
import { useLang } from "@/components/LangContext";
import { t } from "@/lib/i18n";
import { Button, Card, ErrorBox, Spinner, inputCls } from "@/components/ui";

type Msg = {
  role: "user" | "assistant";
  text: string;
  citations?: Citation[];
  confidence?: "high" | "medium" | "low";
};

const SUGGESTIONS_EN = [
  "What's the fine for not wearing a helmet in Mumbai?",
  "Mobile phone while driving in the UK?",
  "Red light fine in Dubai?",
  "DUI penalty in California?",
];
const SUGGESTIONS_HI = [
  "मुंबई में हेलमेट न पहनने का जुर्माना?",
  "दिल्ली में रेड लाइट तोड़ने का जुर्माना?",
  "बिना सीटबेल्ट पकड़े जाने पर?",
  "दुबई में मोबाइल इस्तेमाल पर?",
];

export default function ChatPage() {
  const { lang } = useLang();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loc, setLoc] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, busy]);

  async function send(q: string) {
    const question = q.trim();
    if (!question || busy) return;
    setErr(null);
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: question }]);
    setBusy(true);
    try {
      const r = await postQuery(question, lang, loc || undefined);
      setMsgs((m) => [
        ...m,
        { role: "assistant", text: r.answer, citations: r.citations, confidence: r.confidence },
      ]);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  const suggestions = lang === "hi" ? SUGGESTIONS_HI : SUGGESTIONS_EN;

  return (
    <div className="space-y-5">
      <header className="space-y-1">
        <h1 className="font-serif text-3xl">{t("appName", lang)}</h1>
        <p className="text-ink-muted">{t("tagline", lang)}</p>
      </header>

      <Card className="!p-0">
        <div className="flex flex-col h-[60vh] min-h-[420px]">
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {msgs.length === 0 && (
              <div className="text-ink-muted text-sm space-y-3">
                <p>
                  {lang === "hi"
                    ? "ट्रैफिक कानून के बारे में कुछ भी पूछें — जुर्माना, धारा, अधिकार।"
                    : "Ask anything about traffic law — fines, sections, your rights."}
                </p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-left text-xs rounded-md border border-line bg-paper px-3 py-1.5 hover:border-ink/30"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                <div
                  className={
                    "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed " +
                    (m.role === "user"
                      ? "bg-ink text-paper rounded-br-md"
                      : "bg-paper border border-line rounded-bl-md")
                  }
                >
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-line/80 text-xs text-ink-muted">
                      <span className="uppercase tracking-wide text-[10px] mr-1">
                        {t("citations", lang)}:
                      </span>
                      {m.citations.map((c, j) => (
                        <span key={j} className="mr-2">
                          [{c.section}]
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {busy && (
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <Spinner /> {t("thinking", lang)}
              </div>
            )}

            <div ref={endRef} />
          </div>

          <div className="border-t border-line p-3 bg-paper/50">
            {err && (
              <div className="mb-2">
                <ErrorBox title={t("errorTitle", lang)} message={err} />
              </div>
            )}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex gap-2"
            >
              <input
                value={loc}
                onChange={(e) => setLoc(e.target.value)}
                placeholder={lang === "hi" ? "स्थान (वैकल्पिक)" : "Location (optional)"}
                className={inputCls + " max-w-[180px]"}
              />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("placeholderChat", lang)}
                className={inputCls + " flex-1"}
              />
              <Button type="submit" disabled={busy || !input.trim()}>
                {busy ? <Spinner /> : t("send", lang)}
              </Button>
            </form>
          </div>
        </div>
      </Card>
    </div>
  );
}
