"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

interface AppContextValue {
  /** true once the preloader has finished (or was skipped) */
  isReady: boolean;
  setReady: () => void;
  /** Smoothly scroll to a selector, element or y position */
  scrollTo: (target: string | number | HTMLElement, opts?: { offset?: number; immediate?: boolean }) => void;
  lockScroll: (locked: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const setReady = useCallback(() => {
    setIsReady(true);
    // Layout may change after the preloader leaves, so refresh trigger positions
    requestAnimationFrame(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    });
  }, []);

  // Pinned sections and late-loading fonts/images shift layout; keep trigger positions in sync
  useEffect(() => {
    const refresh = () => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    const t = window.setTimeout(refresh, 600);
    window.addEventListener("load", refresh);
    document.fonts?.ready.then(refresh).catch(() => {});
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("load", refresh);
    };
  }, []);

  const scrollTo = useCallback<AppContextValue["scrollTo"]>((target, opts) => {
    const offset = opts?.offset ?? 0;
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { offset, immediate: opts?.immediate, duration: 1.4, force: true });
      return;
    }
    let y = 0;
    if (typeof target === "number") y = target;
    else {
      const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
      if (!el) return;
      y = el.getBoundingClientRect().top + window.scrollY;
    }
    window.scrollTo({ top: y + offset, behavior: prefersReducedMotion() || opts?.immediate ? "auto" : "smooth" });
  }, []);

  const lockScroll = useCallback((locked: boolean) => {
    const lenis = lenisRef.current;
    if (lenis) {
      if (locked) lenis.stop();
      else lenis.start();
    }
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }, []);

  const value = useMemo(() => ({ isReady, setReady, scrollTo, lockScroll }), [isReady, setReady, scrollTo, lockScroll]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
