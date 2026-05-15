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
    <nav className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-3xl mx-auto px-4">
        <ul className="flex items-center gap-6 overflow-x-auto no-scrollbar">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <li key={link.path} className="flex-shrink-0">
                <Link
                  href={link.path}
                  className={`block py-3 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
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
