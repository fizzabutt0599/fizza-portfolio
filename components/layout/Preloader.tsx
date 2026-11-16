"use client";

import { useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useApp } from "@/components/providers/AppProvider";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

const SEEN_KEY = "fb-preloader-seen";
const STATUS = ["Loading assets", "Warming up", "Building interface", "Polishing pixels", "Ready"];

export function Preloader() {
  const { setReady, lockScroll } = useApp();
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const [done, setDone] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* storage unavailable */
    }

    const finish = () => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* ignore */
      }
      lockScroll(false);
      setDone(true);
      setReady();
    };

    window.scrollTo(0, 0);

    if (document.hidden) {
      // Background tabs don't run animation frames, so skip straight to the content
      finish();
      return;
    }

    if (prefersReducedMotion()) {
      const ctx = gsap.context(() => {
        gsap.to(root, { autoAlpha: 0, duration: 0.4, ease: "power2.out", onComplete: finish });
      }, root);
      return () => ctx.revert();
    }

    lockScroll(true);
    // Quicker on repeat visits in the same tab, full show on the first one
    const total = seen ? 1.4 : 2.6;
    const counter = { value: 0 };
    const render = () => {
      const v = Math.round(counter.value);
      if (countRef.current) countRef.current.textContent = String(v);
      if (statusRef.current) {
        const label = STATUS[Math.min(STATUS.length - 1, Math.floor((v / 100) * STATUS.length))];
        if (statusRef.current.textContent !== label) statusRef.current.textContent = label;
      }
    };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".pl-letter", { yPercent: 120, duration: 1, stagger: 0.06, ease: "expo.out" })
        .from(".pl-meta", { opacity: 0, y: 12, duration: 0.6, stagger: 0.05 }, 0.2)
        .from(".pl-count", { yPercent: 100, opacity: 0, duration: 0.8, ease: "expo.out" }, 0.1);

      // Counter climbs in uneven bursts (like real loading) instead of one smooth line
      const steps = [
        [18, 0.18], [34, 0.16], [41, 0.1], [63, 0.2], [72, 0.12], [88, 0.18], [94, 0.1], [100, 0.16],
      ] as const;
      let at = 0.2;
      steps.forEach(([to, share]) => {
        const d = share * total;
        tl.to(counter, { value: to, duration: d, ease: "power3.out", onUpdate: render }, at);
        tl.to(".pl-bar", { scaleX: to / 100, duration: d, ease: "power3.out" }, at);
        at += d;
      });

      tl.to(".pl-count", { color: "#c6ff3d", duration: 0.3 }, at - 0.1)
        .to(".pl-glow", { opacity: 1, scale: 1.15, duration: 0.5, ease: "power2.out" }, at - 0.2)
        .to(".pl-letter, .pl-count", { yPercent: -120, duration: 0.7, stagger: 0.03, ease: "expo.in" }, at + 0.25)
        .to(".pl-meta", { opacity: 0, duration: 0.3 }, "<")
        .to(root, { clipPath: "inset(0 0 100% 0)", duration: 1, ease: "expo.inOut" }, "-=0.2")
        .add(finish, "-=0.55");
    }, root);

    return () => {
      ctx.revert();
      lockScroll(false);
    };
  }, [lockScroll, setReady]);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-[100] flex flex-col justify-between overflow-hidden bg-ink p-6 sm:p-10"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div
        aria-hidden="true"
        className="pl-glow pointer-events-none absolute bottom-[-20%] right-[-10%] h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(closest-side,rgba(198,255,61,0.18),transparent)] opacity-40 blur-2xl"
      />

      <div className="pl-meta relative flex justify-between text-xs uppercase tracking-[0.2em] text-mute">
        <span>Portfolio ©{new Date().getFullYear()}</span>
        <span>Islamabad, PK</span>
      </div>

      <div className="relative flex flex-col gap-6">
        <div className="flex items-end justify-between gap-6">
          <p
            className="overflow-hidden font-display text-[clamp(3.5rem,13vw,11rem)] font-bold leading-[0.85] tracking-[-0.05em]"
            aria-hidden="true"
          >
            {"Fizza".split("").map((l, i) => (
              <span key={i} className="pl-letter inline-block">
                {l}
              </span>
            ))}
            <span className="pl-letter inline-block font-serif font-normal italic text-lime">.</span>
          </p>
          <p className="shrink-0 [clip-path:inset(0_-20%_0_-20%)]" aria-hidden="true">
            <span className="pl-count inline-flex items-start pr-[0.06em] font-display text-[clamp(4.5rem,17vw,15rem)] font-light leading-[0.85] tracking-[-0.06em] tabular-nums text-paper">
              <span ref={countRef}>0</span>
              <span className="ml-[0.06em] mt-[0.12em] text-[0.3em] tracking-normal text-lime">%</span>
            </span>
          </p>
        </div>

        <div className="pl-meta flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-mute">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime shadow-[0_0_8px_#c6ff3d]" />
            <span ref={statusRef}>{STATUS[0]}</span>
          </span>
          <span>Full Stack Developer</span>
        </div>

        <div className="pl-meta h-[2px] w-full overflow-hidden rounded-full bg-paper/10">
          <div className="pl-bar h-full origin-left scale-x-0 bg-lime shadow-[0_0_12px_#c6ff3d]" />
        </div>
      </div>
    </div>
  );
}
