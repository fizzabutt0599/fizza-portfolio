"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDownToLine } from "lucide-react";
import { navItems, siteConfig } from "@/data/portfolio";
import { useApp } from "@/components/providers/AppProvider";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { Magnetic } from "@/components/ui/Magnetic";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const { isReady, scrollTo } = useApp();
  const headerRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // On large screens the hero has its own top bar + pill nav, so the fixed bar waits until you leave it
  const [inHero, setInHero] = useState(true);
  useEffect(() => {
    const home = document.getElementById("home");
    if (!home) return;
    const io = new IntersectionObserver(([e]) => setInHero(e.intersectionRatio > 0.35), {
      threshold: [0, 0.35, 0.6, 1],
    });
    io.observe(home);
    return () => io.disconnect();
  }, []);

  // Entrance once the preloader is done
  useEffect(() => {
    const el = headerRef.current;
    if (!el || !isReady) return;
    if (prefersReducedMotion()) {
      gsap.set(el, { visibility: "visible" });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(el, { visibility: "visible" });
      gsap.from(".nav-item", { y: -24, autoAlpha: 0, duration: 0.7, stagger: 0.05, delay: 0.35, ease: "power3.out" });
    }, el);
    return () => ctx.revert();
  }, [isReady]);

  // Active section indicator
  useEffect(() => {
    const sections = navItems
      .map((n) => document.getElementById(n.id))
      .filter((s): s is HTMLElement => Boolean(s));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  // Scroll progress (transform only)
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;
    const setScale = gsap.quickSetter(bar, "scaleX");
    // Cache the scroll range so the scroll handler never forces a layout
    let max = 1;
    const measure = () => {
      max = document.documentElement.scrollHeight - window.innerHeight;
    };
    const onScroll = () => setScale(max > 0 ? window.scrollY / max : 0);
    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    ScrollTrigger.addEventListener("refresh", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      ScrollTrigger.removeEventListener("refresh", measure);
    };
  }, []);

  // Compact on scroll + hide when scrolling down
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 40);
        setHidden(y > 400 && y > lastY + 4);
        if (y < lastY - 4) setHidden(false);
        lastY = y;
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = useCallback(
    (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      setMenuOpen(false);
      scrollTo(id === "home" ? 0 : `#${id}`, { offset: id === "home" ? 0 : -20 });
      history.replaceState(null, "", id === "home" ? "/" : `#${id}`);
      // move focus for keyboard + screen reader users
      const target = document.getElementById(id);
      target?.setAttribute("tabindex", "-1");
      target?.focus({ preventScroll: true });
    },
    [scrollTo],
  );

  return (
    <>
      <header
        ref={headerRef}
        className={`invisible fixed inset-x-0 top-0 z-50 transition-[transform,opacity] duration-500 ease-[var(--ease-expo)] ${
          hidden && !menuOpen ? "-translate-y-full" : "translate-y-0"
        } ${inHero && !menuOpen ? "lg:pointer-events-none lg:-translate-y-[120%] lg:opacity-0" : "lg:opacity-100"
        }`}
      >
        <div
          ref={progressRef}
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r from-lime to-violet"
        />
        <div className="container-x pt-4">
          <nav
            aria-label="Primary"
            className={`flex items-center justify-between rounded-full border px-3 py-2 transition-all duration-500 sm:px-4 ${
              scrolled ? "bg-gradient-to-b from-paper/[0.08] to-paper/[0.02] bg-ink/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_10px_40px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md backdrop-saturate-150 border-paper/15" : "border-transparent bg-transparent"
            }`}
          >
            <a
              href="#home"
              onClick={go("home")}
              className="nav-item group flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3"
              aria-label={`${siteConfig.name} — back to top`}
            >
              <span className="grid h-9 w-9 place-items-center rounded-full bg-lime font-display text-sm font-bold text-ink transition-transform duration-500 group-hover:rotate-[360deg]">
                {siteConfig.initials}
              </span>
              <span className="hidden font-display text-base font-semibold tracking-tight sm:inline">
                {siteConfig.name}
              </span>
            </a>

            <ul className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => {
                const isActive = active === item.id;
                return (
                  <li key={item.id} className="nav-item">
                    <a
                      href={`#${item.id}`}
                      onClick={go(item.id)}
                      aria-current={isActive ? "location" : undefined}
                      className={`relative block rounded-full px-4 py-2 text-sm transition-colors duration-300 ${
                        isActive ? "text-ink" : "text-paper/70 hover:bg-paper/[0.06] hover:text-paper"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute inset-0 -z-10 rounded-full bg-paper transition-all duration-500 ease-[var(--ease-expo)] ${
                          isActive ? "scale-100 opacity-100" : "scale-75 opacity-0"
                        }`}
                      />
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center gap-2">
              <Magnetic className="nav-item hidden sm:inline-block">
                <a
                  href={siteConfig.resume}
                  download
                  className="inline-flex items-center gap-2 rounded-full bg-lime px-4 py-2.5 text-sm font-medium text-ink transition-colors duration-300 hover:bg-paper"
                >
                  <ArrowDownToLine size={16} aria-hidden="true" />
                  Resume
                </a>
              </Magnetic>
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="nav-item relative z-[70] grid h-11 w-11 place-items-center rounded-full border border-paper/20 bg-ink/60 lg:hidden"
              >
                <span className="relative block h-3 w-5" aria-hidden="true">
                  <span
                    className={`absolute left-0 top-0 h-[1.5px] w-full bg-paper transition-transform duration-500 ${
                      menuOpen ? "translate-y-[5px] rotate-45" : ""
                    }`}
                  />
                  <span
                    className={`absolute bottom-0 left-0 h-[1.5px] w-full bg-paper transition-transform duration-500 ${
                      menuOpen ? "-translate-y-[5.5px] -rotate-45" : ""
                    }`}
                  />
                </span>
              </button>
            </div>
          </nav>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} active={active} onNavigate={go} />
    </>
  );
}

/** Lightweight header for inner pages (project details, 404). */
export function PageHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="container-x pt-4">
        <nav
          aria-label="Primary"
          className="flex items-center justify-between rounded-full border border-paper/10 bg-ink/45 bg-gradient-to-b from-paper/[0.08] to-paper/[0.02] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-md backdrop-saturate-150 sm:px-4"
        >
          <Link href="/" className="group flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-lime font-display text-sm font-bold text-ink transition-transform duration-500 group-hover:rotate-[360deg]">
              {siteConfig.initials}
            </span>
            <span className="font-display text-base font-semibold tracking-tight">{siteConfig.name}</span>
          </Link>
          <Link
            href="/#projects"
            className="rounded-full border border-paper/20 px-4 py-2 text-sm transition-colors hover:border-lime hover:text-lime"
          >
            All projects
          </Link>
        </nav>
      </div>
    </header>
  );
}
