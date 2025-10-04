"use client";
import { useEffect, useState } from "react";
import { DataNav } from "../data/dataNav";
import { WebSettings } from "../types/web-settings";
import { SearchPopover } from "./searchPopover";
import { AuthDropdown } from "../modules/auth/component/AuthDropdown";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Navbar({ data }: { data: WebSettings }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={[
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-background/70 backdrop-blur-xl border-b border-border/50 shadow-lg"
            : "bg-transparent",
        ].join(" ")}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2" aria-label="Home">
              <div className="relative group">
                <div
                  className={[
                    "absolute inset-0 bg-primary/20 blur-xl transition-opacity duration-300",
                    scrolled ? "opacity-0" : "opacity-100 group-hover:opacity-100",
                  ].join(" ")}
                />
                <Image
                  src={data.logo_url || "/placeholder.svg"}
                  alt="Logo"
                  width={120}
                  height={40}
                  className="relative h-10 w-auto"
                  priority
                />
              </div>
            </Link>

            {/* Pill Nav - Desktop */}
            <nav
              aria-label="Primary"
              className={[
                "hidden md:flex items-center rounded-full px-2 py-1.5 transition-all duration-300",
                scrolled
                  ? "bg-card/60 backdrop-blur-xl border border-border/60 shadow-lg"
                  : "bg-background/40 backdrop-blur-md border border-border/40",
              ].join(" ")}
            >
              <ul className="flex items-center gap-1">
                {DataNav.map((item) => {
                  const isActive = pathname === item.link;
                  return (
                    <li key={item.link}>
                      <Link
                        href={item.link}
                        className={[
                          "px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                            : "text-foreground/80 hover:text-foreground hover:bg-primary/10",
                        ].join(" ")}
                      >
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="flex items-center gap-2">
              <SearchPopover />
              <AuthDropdown />
            </div>
          </div>
        </div>
      </header>

      {/* Bottom Navigation Bar - Mobile */}
      <nav
        aria-label="Mobile"
        className="md:hidden fixed bottom-4 left-4 right-4 z-50"
      >
        <div className="bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl shadow-2xl shadow-black/20">
          <div className="px-2 py-2">
            <ul className="flex items-center justify-between gap-1">
              {DataNav.map((item) => {
                const isActive = pathname === item.link;
                return (
                  <li key={item.link} className="flex-1">
                    <Link
                      href={item.link}
                      className={[
                        "flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-xl transition-all duration-200 min-w-0",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30"
                          : "text-foreground/70 hover:text-foreground hover:bg-primary/10 active:scale-95",
                      ].join(" ")}
                    >
                     
                      <span className="text-[10px] font-medium truncate w-full text-center">
                        {item.name}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </nav>

      <div className="md:hidden h-32" aria-hidden />
    </>
  );
}