"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Cars" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/dealer", label: "Dealer" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  const pathname = usePathname();

  const isActiveLink = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-line)] bg-[rgba(248,245,236,0.78)] backdrop-blur">
      <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 rounded-[28px] border border-[var(--color-line)] bg-white/70 p-4 shadow-[var(--shadow-card)] lg:flex-row lg:items-center lg:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-brand)] text-sm font-bold text-white">
              CA
            </div>
            <div>
              <p className="text-lg font-extrabold tracking-tight text-slate-900">CarApp</p>
              <p className="text-xs text-[var(--color-text-soft)]">Marketplace starter</p>
            </div>
          </Link>

          <nav className="flex flex-wrap gap-2">
            {navLinks.map((link) => {
              const active = isActiveLink(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-slate-900 text-white"
                      : "border border-transparent text-slate-700 hover:border-[var(--color-line-strong)] hover:bg-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
