"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Chat", path: "/" },
    { name: "Calculator", path: "/calculator" },
    { name: "Rights", path: "/rights" },
    { name: "Verify", path: "/verify" },
  ];

  return (
    <nav className="sticky top-16 z-40 bg-[rgba(11,19,38,0.7)] backdrop-blur-md border-b border-white/5">
      <div className="max-w-3xl mx-auto px-4">
        <ul className="flex items-center gap-8 overflow-x-auto no-scrollbar">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <li key={link.path} className="flex-shrink-0">
                <Link
                  href={link.path}
                  className={`block py-4 text-sm font-semibold transition-all duration-200 border-b-2 ${
                    isActive
                      ? "border-[#2563eb] text-[#2563eb] shadow-[0_4px_12px_rgba(37,99,235,0.2)]"
                      : "border-transparent text-gray-400 hover:text-gray-200"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
