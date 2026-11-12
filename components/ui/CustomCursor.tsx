"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * Dot + ring cursor. Elements can opt in to states with:
 *  - data-cursor="hover"        → ring grows
 *  - data-cursor-label="View"   → ring becomes a labelled disc
 * Only enabled on fine pointers without reduced-motion.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!fine || prefersReducedMotion()) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    let visible = false;
    const onMove = (e: PointerEvent) => {
      if (!visible) {
        visible = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
      }
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      const labelled = target?.closest<HTMLElement>("[data-cursor-label]");
      const interactive = target?.closest<HTMLElement>("a, button, [data-cursor='hover'], input, textarea, select, label");
      if (labelled) {
        setLabel(labelled.dataset.cursorLabel ?? null);
        gsap.to(ring, { scale: 2.6, backgroundColor: "#c6ff3d", borderColor: "#c6ff3d", duration: 0.4 });
        gsap.to(dot, { scale: 0, duration: 0.2 });
      } else if (interactive) {
        setLabel(null);
        gsap.to(ring, { scale: 1.7, backgroundColor: "rgba(198,255,61,0.08)", borderColor: "#c6ff3d", duration: 0.4 });
        gsap.to(dot, { scale: 0.5, duration: 0.2 });
      } else {
        setLabel(null);
        gsap.to(ring, { scale: 1, backgroundColor: "rgba(0,0,0,0)", borderColor: "rgba(243,239,230,0.45)", duration: 0.4 });
        gsap.to(dot, { scale: 1, duration: 0.2 });
      }
    };

    const onLeave = () => {
      visible = false;
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    };
    const onDown = () => gsap.to(ring, { scale: "-=0.25", duration: 0.15 });
    const onUp = () => gsap.to(ring, { scale: "+=0.25", duration: 0.25 });

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      gsap.killTweensOf([dot, ring]);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[90]">
      <div
        ref={ringRef}
        className="fixed left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-paper/45"
      >
        <span
          className={`scale-[0.385] whitespace-nowrap text-[11px] font-semibold uppercase tracking-wider text-ink transition-opacity duration-200 ${
            label ? "opacity-100" : "opacity-0"
          }`}
        >
          {label}
        </span>
      </div>
      <div ref={dotRef} className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-lime" />
    </div>
  );
}
