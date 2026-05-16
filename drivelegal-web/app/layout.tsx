import "./globals.css";
import type { Metadata } from "next";
import { LangProvider } from "@/components/LangContext";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "DriveLegal — Know your fine. Know your rights.",
  description: "AI-powered, location-aware traffic-law assistant.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-ink">
        <LangProvider>
          <Header />
          <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
          <footer className="border-t border-line mt-12">
            <div className="mx-auto max-w-5xl px-5 py-6 text-xs text-ink-faint flex flex-wrap justify-between gap-2">
              <span>Road Safety Hackathon 2026 · CoERS / RBG Labs / IIT Madras</span>
              <span>India · UK · UAE · USA</span>
            </div>
          </footer>
        </LangProvider>
      </body>
    </html>
  );
}
