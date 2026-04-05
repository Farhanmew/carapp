"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "@/components/Button";
import newLogo from "@/newlogo.png";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/cars", label: "Cars" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/dealer", label: "Dealer" },
  { href: "/admin", label: "Admin" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActiveLink = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  useEffect(() => {
    // Close the mobile menu after navigation so the next page starts clean.
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/70 backdrop-blur-xl">
      <div className="mx-auto w-full max-w-6xl px-4 py-3 sm:px-5 lg:px-6">
        <div className="rounded-[26px] border border-white/80 bg-white/82 px-4 py-3 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white shadow-sm">
                <Image
                  src={newLogo}
                  alt="valuedrivee logo"
                  className="h-full w-full object-contain"
                  priority
                  sizes="48px"
                />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-extrabold tracking-tight text-slate-900">valuedrivee</p>
                <p className="text-xs text-[var(--color-text-soft)]">Marketplace starter</p>
              </div>
            </Link>

            {/* Keep the desktop navbar in three clear areas: logo, centered links, and CTA. */}
            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:px-6">
              <nav className="flex items-center gap-1 xl:gap-2">
                {navLinks.map((link) => {
                  const active = isActiveLink(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                        active
                          ? "border border-blue-200 bg-blue-50 text-[var(--color-brand)] shadow-sm ring-1 ring-blue-100"
                          : "border border-transparent text-slate-700 hover:border-[var(--color-line-strong)] hover:bg-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="hidden lg:flex lg:items-center">
              <Button href="/dealer" size="md" className="px-5 shadow-lg shadow-blue-500/20">
                List Your Car
              </Button>
            </div>

            {/* Show a compact menu button on small screens and the full nav on desktop. */}
            <button
              type="button"
              onClick={() => setMenuOpen((currentValue) => !currentValue)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--color-line-strong)] bg-white/90 text-slate-700 transition-all duration-300 hover:bg-white lg:hidden"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {menuOpen ? (
            <div className="mt-4 border-t border-[var(--color-line)] pt-4 lg:hidden">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const active = isActiveLink(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                        active
                          ? "border border-blue-200 bg-blue-50 text-[var(--color-brand)] shadow-sm ring-1 ring-blue-100"
                          : "border border-transparent text-slate-700 hover:border-[var(--color-line-strong)] hover:bg-white"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4">
                <Button href="/dealer" fullWidth className="shadow-lg shadow-blue-500/20">
                  List Your Car
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
