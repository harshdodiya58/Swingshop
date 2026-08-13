"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, User, X } from "lucide-react";
import { siteConfig, categoryNav } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { HeaderCounts } from "@/components/layout/header-counts";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [announcementIndex, setAnnouncementIndex] = useState(0);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(
      () => setAnnouncementIndex((i) => (i + 1) % siteConfig.announcement.length),
      4000,
    );
    return () => clearInterval(id);
  }, []);

  const closeMenu = () => setMobileOpen(false);

  const isHome = pathname === "/";
  const solid = scrolled || !isHome || mobileOpen;

  return (
    <div className="sticky top-0 z-50">
      {/* Announcement bar */}
      <div className="bg-sage text-ivory">
        <div className="mx-auto flex max-w-7xl items-center justify-center overflow-hidden px-4 py-1.5 text-center text-xs tracking-wide sm:text-[13px]">
          <AnimatePresence mode="wait">
            <motion.span
              key={announcementIndex}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {siteConfig.announcement[announcementIndex]}
              <span className="mx-2 text-gold" aria-hidden>
                •
              </span>
              <span className="text-gold">5 Year Warranty</span>
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Navbar */}
      <header
        className={cn(
          "transition-all duration-300",
          solid
            ? "border-b border-line bg-cream/90 backdrop-blur-md shadow-soft"
            : "bg-transparent",
        )}
      >
        <nav
          className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6 lg:px-8"
          aria-label="Primary"
        >
          <Logo tone={solid ? "dark" : "dark"} className="shrink-0" />

          {/* Desktop nav */}
          <ul className="hidden items-center gap-5 lg:flex xl:gap-7">
            {siteConfig.nav.primary.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "text-sm font-medium tracking-wide transition-colors hover:text-wood-deep",
                    pathname === item.href ? "text-wood-deep" : "text-ink/80",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              aria-label="Search"
              className="rounded-full p-2 text-ink transition-colors hover:bg-wood/10 hover:text-wood-deep"
              onClick={() => router.push("/shop")}
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/account"
              aria-label="Account"
              className="hidden rounded-full p-2 text-ink transition-colors hover:bg-wood/10 hover:text-wood-deep sm:inline-flex"
            >
              <User className="h-5 w-5" />
            </Link>
            <HeaderCounts />
            <button
              type="button"
              aria-label="Menu"
              className="rounded-full p-2 text-ink transition-colors hover:bg-wood/10 lg:hidden"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden border-t border-line bg-cream lg:hidden"
            >
              <ul className="flex flex-col px-6 py-4">
                {siteConfig.nav.primary.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className={cn(
                        "block py-3 text-base font-medium transition-colors hover:text-wood-deep",
                        pathname === item.href ? "text-wood-deep" : "text-ink/85",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li className="mt-2 border-t border-line pt-3">
                  <p className="eyebrow mb-2 text-wood">Categories</p>
                  <ul className="grid grid-cols-2 gap-x-4">
                    {categoryNav.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={c.href}
                          onClick={closeMenu}
                          className="block py-2 text-sm text-ink/75 hover:text-wood-deep"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}