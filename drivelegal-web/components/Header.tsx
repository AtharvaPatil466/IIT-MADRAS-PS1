"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "./LangContext";
import { t } from "@/lib/i18n";

const NAV = [
  { href: "/", key: "navChat" as const },
  { href: "/calculator", key: "navCalc" as const },
  { href: "/rights", key: "navRights" as const },
  { href: "/verify", key: "navVerify" as const },
];

export function Header() {
  const { lang, setLang } = useLang();
  const path = usePathname();

  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto max-w-5xl px-5 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-block h-7 w-7 rounded-md bg-accent text-paper grid place-items-center font-serif text-sm">
            DL
          </span>
          <div className="leading-tight">
            <div className="font-serif text-lg">{t("appName", lang)}</div>
            <div className="text-xs text-ink-muted hidden sm:block">{t("tagline", lang)}</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 text-sm">
          {NAV.map((n) => {
            const active = path === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={
                  "px-3 py-1.5 rounded-md transition " +
                  (active
                    ? "bg-ink text-paper"
                    : "text-ink-muted hover:text-ink hover:bg-line")
                }
              >
                {t(n.key, lang)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center rounded-md border border-line overflow-hidden text-sm">
          <button
            onClick={() => setLang("en")}
            className={"px-2.5 py-1 " + (lang === "en" ? "bg-ink text-paper" : "text-ink-muted")}
            aria-pressed={lang === "en"}
          >
            EN
          </button>
          <button
            onClick={() => setLang("hi")}
            className={"px-2.5 py-1 " + (lang === "hi" ? "bg-ink text-paper" : "text-ink-muted")}
            aria-pressed={lang === "hi"}
          >
            हिं
          </button>
        </div>
      </div>

      <div className="md:hidden border-t border-line bg-paper">
        <div className="mx-auto max-w-5xl px-3 py-2 flex gap-1 overflow-x-auto text-sm">
          {NAV.map((n) => {
            const active = path === n.href;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={
                  "whitespace-nowrap px-3 py-1.5 rounded-md " +
                  (active ? "bg-ink text-paper" : "text-ink-muted")
                }
              >
                {t(n.key, lang)}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
