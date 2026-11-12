"use client";

import { useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useApp } from "@/components/providers/AppProvider";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

const SEEN_KEY = "fb-preloader-seen";

export function Preloader() {
  const { setReady, lockScroll } = useApp();
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
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

    if (prefersReducedMotion() || seen) {
      const ctx = gsap.context(() => {
        gsap.to(root, { autoAlpha: 0, duration: 0.4, ease: "power2.out", onComplete: finish });
      }, root);
      return () => ctx.revert();
    }

    lockScroll(true);
    const counter = { value: 0 };
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.from(".pl-letter", { yPercent: 120, duration: 1, stagger: 0.06, ease: "expo.out" })
        .from(".pl-meta", { opacity: 0, y: 12, duration: 0.6 }, 0.2)
        .to(
          counter,
          {
            value: 100,
            duration: 1.6,
            ease: "power2.inOut",
            onUpdate: () => {
              if (countRef.current) countRef.current.textContent = String(Math.round(counter.value)).padStart(3, "0");
            },
          },
          0.1,
        )
        .to(".pl-bar", { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, 0.1)
        .to(".pl-letter", { yPercent: -120, duration: 0.7, stagger: 0.04, ease: "expo.in" }, "+=0.15")
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
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-6 sm:p-10"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <div className="pl-meta flex justify-between text-xs uppercase tracking-[0.2em] text-mute">
        <span>Portfolio ©{new Date().getFullYear()}</span>
        <span>Islamabad, PK</span>
      </div>

      <div className="flex items-end justify-between gap-6">
        <p
          className="overflow-hidden font-display text-[clamp(4rem,16vw,14rem)] font-bold leading-[0.85] tracking-[-0.05em]"
          aria-hidden="true"
        >
          {"Fizza".split("").map((l, i) => (
            <span key={i} className="pl-letter inline-block">
              {l}
            </span>
          ))}
          <span className="pl-letter inline-block font-serif font-normal italic text-lime">.</span>
        </p>
        <span className="pl-meta pb-3 font-display text-3xl tabular-nums text-paper sm:text-5xl">
          <span ref={countRef}>000</span>
          <span className="text-mute">%</span>
        </span>
      </div>

      <div className="pl-meta h-px w-full bg-paper/10">
        <div className="pl-bar h-full origin-left scale-x-0 bg-lime" />
      </div>
    </div>
  );
}
