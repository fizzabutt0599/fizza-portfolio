"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import { siteConfig, socialLinks } from "@/data/portfolio";
import { useApp } from "@/components/providers/AppProvider";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { Magnetic } from "@/components/ui/Magnetic";
import { SocialIcon } from "@/components/ui/BrandIcons";

export function Footer() {
  const { scrollTo } = useApp();
  const rootRef = useRef<HTMLElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const [year, setYear] = useState<number | null>(null);

  // Set on the client to avoid a stale year in statically generated HTML
  useEffect(() => setYear(new Date().getFullYear()), []);

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".ft-letter", {
        yPercent: 100,
        duration: 0.9,
        stagger: 0.04,
        ease: "expo.out",
        scrollTrigger: { trigger: ".ft-name", start: "top 95%", once: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // Progress ring around the back-to-top button
  const ringRef = useRef<SVGCircleElement>(null);
  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    const len = 2 * Math.PI * 54;
    ring.style.strokeDasharray = String(len);
    let max = 1;
    const measure = () => {
      max = document.documentElement.scrollHeight - window.innerHeight;
    };
    const onScroll = () => {
      const p = max > 0 ? window.scrollY / max : 0;
      ring.style.strokeDashoffset = String(len * (1 - p));
    };
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

  const backToTop = () => {
    const arrow = arrowRef.current;
    if (arrow && !prefersReducedMotion()) {
      gsap
        .timeline()
        .to(arrow, { yPercent: -150, duration: 0.35, ease: "power2.in" })
        .set(arrow, { yPercent: 150 })
        .to(arrow, { yPercent: 0, duration: 0.5, ease: "expo.out" });
    }
    scrollTo(0);
    document.getElementById("home")?.focus({ preventScroll: true });
  };

  return (
    <footer ref={rootRef} className="relative overflow-hidden border-t border-paper/10 bg-ink pt-20">
      <div className="container-x">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="max-w-md font-display text-xl font-light leading-snug tracking-tight sm:text-2xl">
              Thanks for scrolling this far. <span className="font-serif italic text-lime">Good software is kind</span>{" "}
              — let’s make something that people enjoy using.
            </p>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow text-mute">Elsewhere</p>
            <ul className="mt-4 space-y-2">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.label === "Email" ? undefined : "_blank"}
                    rel={s.label === "Email" ? undefined : "noopener noreferrer"}
                    className="group inline-flex items-center gap-2.5 text-paper/80 transition-colors hover:text-lime"
                  >
                    <SocialIcon label={s.label} size={16} />
                    <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
                      {s.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex md:col-span-3 md:justify-end">
            <Magnetic strength={0.5}>
              <button
                type="button"
                onClick={backToTop}
                className="group relative grid h-28 w-28 place-items-center rounded-full border border-paper/15 text-center text-xs uppercase transition-colors duration-500 hover:border-lime hover:bg-lime hover:text-ink"
                aria-label="Back to top"
              >
                <svg className="pointer-events-none absolute inset-0 -rotate-90" viewBox="0 0 112 112" aria-hidden="true">
                  <circle ref={ringRef} cx="56" cy="56" r="54" fill="none" stroke="#c6ff3d" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="flex flex-col items-center gap-2">
                  <span className="overflow-hidden">
                    <span ref={arrowRef} className="block">
                      <ArrowUp size={22} aria-hidden="true" />
                    </span>
                  </span>
                  <span className="text-[10px] leading-tight tracking-[0.18em]">
                    Back
                    <br />
                    to top
                  </span>
                </span>
              </button>
            </Magnetic>
          </div>
        </div>

        <p
          className="ft-name mt-20 overflow-hidden whitespace-nowrap text-center font-display text-[clamp(3rem,13vw,11rem)] font-normal leading-[0.85] tracking-[-0.05em] text-paper"
          aria-hidden="true"
        >
          {siteConfig.name.split("").map((l, i) => (
            <span key={i} className="ft-letter inline-block">
              {l === " " ? " " : l}
            </span>
          ))}
        </p>

        <div className="flex flex-col gap-3 border-t border-paper/10 py-6 text-sm text-mute sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year ?? ""} {siteConfig.name} · {siteConfig.role}
          </p>
          <p>Designed &amp; built in {siteConfig.location}</p>
        </div>
      </div>
    </footer>
  );
}
