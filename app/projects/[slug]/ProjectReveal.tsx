"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

/** Page-load + scroll reveals for the project detail page. */
export function ProjectReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.from(".pr-fade", { y: 40, opacity: 0, duration: 1.1, stagger: 0.08, delay: 0.1 });
      gsap.fromTo(
        ".pr-media",
        { clipPath: "inset(0 0 100% 0 round 28px)" },
        { clipPath: "inset(0 0 0% 0 round 28px)", duration: 1.1, ease: "expo.inOut", delay: 0.3 },
      );
      gsap.fromTo(
        ".pr-img",
        { scale: 1.2 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: { trigger: ".pr-media", start: "top 80%", end: "bottom top", scrub: true },
        },
      );
    }, ref);
    return () => ctx.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}
