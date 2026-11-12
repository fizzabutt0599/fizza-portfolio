"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { SplitWords } from "./SplitWords";

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  highlight?: string[];
  tone?: "dark" | "light";
  id?: string;
  className?: string;
}

/** Numbered eyebrow + masked, word-by-word heading reveal on scroll. */
export function SectionHeading({ index, eyebrow, title, highlight, tone = "dark", id, className }: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!ref.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      });
      tl.from(".sh-line", { scaleX: 0, transformOrigin: "left center", duration: 1.2 })
        .from(".sh-eyebrow", { yPercent: 100, opacity: 0, duration: 0.8 }, 0.1)
        .from(".sh-word", { yPercent: 110, rotate: 4, duration: 0.85, stagger: 0.045 }, 0.15);
    }, ref);
    return () => ctx.revert();
  }, []);

  const eyebrowColor = tone === "dark" ? "text-mute" : "text-mute-dark";

  return (
    <div ref={ref} className={className}>
      <div className="flex items-center gap-4">
        <span className="overflow-hidden py-0.5">
          <span
            className={`sh-eyebrow inline-flex items-center gap-2.5 rounded-full border py-1 pl-1 pr-4 ${
              tone === "dark" ? "border-paper/10 bg-paper/[0.03]" : "border-ink/10 bg-ink/[0.03]"
            }`}
          >
            <span className="grid h-6 min-w-6 place-items-center rounded-full bg-lime px-1.5 font-display text-[11px] font-semibold text-ink">
              {index}
            </span>
            <span className={`eyebrow ${eyebrowColor}`}>{eyebrow}</span>
          </span>
        </span>
        <span
          className={`sh-line h-px flex-1 bg-gradient-to-r ${tone === "dark" ? "from-lime/40 via-paper/10" : "from-ink/30 via-ink/10"} to-transparent`}
          aria-hidden="true"
        />
      </div>
      <h2
        id={id}
        className={`mt-6 max-w-5xl font-display text-[clamp(2rem,4vw,3.5rem)] font-normal leading-[1.08] tracking-[-0.03em] ${tone === "dark" ? "text-white" : "text-ink"}`}
      >
        <SplitWords
          text={title}
          wordClassName="sh-word"
          highlight={highlight}
          highlightClassName={`font-serif italic font-normal ${tone === "dark" ? "text-lime" : "text-[#5b21b6]"}`}
        />
      </h2>
    </div>
  );
}
