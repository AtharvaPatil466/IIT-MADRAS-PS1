import * as React from "react";

export function Card({
  children, className = "",
}: { children: React.ReactNode; className?: string }) {
  return (
    <div className={"rounded-xl border border-line bg-white p-5 " + className}>
      {children}
    </div>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs uppercase tracking-wide text-ink-muted mb-1.5">{children}</label>;
}

export const inputCls =
  "w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:border-ink/50 focus:ring-2 focus:ring-ink/10";

export function Button({
  children, className = "", ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className={
        "inline-flex items-center justify-center rounded-md bg-ink text-paper px-4 py-2 text-sm font-medium hover:bg-ink/90 disabled:opacity-50 disabled:cursor-not-allowed " +
        className
      }
    />
  );
}

export function Badge({
  tone, children,
}: { tone: "good" | "bad" | "warn" | "neutral"; children: React.ReactNode }) {
  const tones = {
    good: "bg-emerald-50 text-emerald-800 border-emerald-200",
    bad: "bg-rose-50 text-rose-800 border-rose-200",
    warn: "bg-amber-50 text-amber-900 border-amber-200",
    neutral: "bg-line text-ink-muted border-line",
  } as const;
  return (
    <span className={"inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium " + tones[tone]}>
      {children}
    </span>
  );
}

export function ErrorBox({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
      <div className="font-medium">{title}</div>
      <div className="text-rose-800/90">{message}</div>
    </div>
  );
}

export function Spinner() {
  return (
    <span
      aria-label="loading"
      className="inline-block h-4 w-4 rounded-full border-2 border-ink/30 border-t-ink animate-spin align-middle"
    />
  );
}
