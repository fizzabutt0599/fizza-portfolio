"use client";

import { useRef } from "react";
import { ArrowUpRight, Briefcase, Code2, Layers, MapPin, type LucideIcon } from "lucide-react";
import { about, experiences, siteConfig, stats } from "@/data/portfolio";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** Technologies inside the about text that get highlighted. */
const TECH = new Set([
  "React.js",
  "Next.js",
  "TypeScript",
  "WordPress",
  "PHP",
  "Laravel",
  "MySQL",
  "WooCommerce",
  "REST",
  "APIs",
]);

const STACK = ["React.js", "Next.js", "TypeScript", "Laravel", "PHP", "WordPress", "WooCommerce", "MySQL"];

const STAT_ICONS: LucideIcon[] = [Layers, Code2, Briefcase, MapPin];

export function About() {
  const rootRef = useRef<HTMLElement>(null);
  const current = experiences[0];

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Each tile rises in when it reaches the viewport
      // Stat cards flip up one after another
      gsap.fromTo(
        ".ab-stat",
        { y: 50, opacity: 0, rotateX: -35, scale: 0.9, transformPerspective: 800, transformOrigin: "50% 100%" },
        {
          y: 0, opacity: 1, rotateX: 0, scale: 1,
          duration: 1, stagger: 0.12, ease: "back.out(1.6)",
          scrollTrigger: { trigger: ".ab-stats", start: "top 85%", once: true },
          clearProps: "transform",
        },
      );

      gsap.utils.toArray<HTMLElement>(".ab-tile:not(.ab-stat)").forEach((tile, i) => {
        gsap.fromTo(
          tile,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            delay: (i % 4) * 0.06,
            ease: "power3.out",
            scrollTrigger: { trigger: tile, start: "top 95%", once: true },
          },
        );
      });

      // Text fills in word by word while scrolling
      gsap.fromTo(
        ".ab-word",
        { opacity: 0.2 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: "none",
          scrollTrigger: { trigger: ".ab-text", start: "top 80%", end: "bottom 60%", scrub: true },
        },
      );

      // Count-up for numeric stats
      gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
        const target = Number(el.dataset.count);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v));
          },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={rootRef} aria-labelledby="about-heading" className="relative bg-ink py-10 sm:py-14">
      <div className="container-x">
        <SectionHeading
          id="about-heading"
          index="01"
          eyebrow="About"
          title="Turning complex ideas into calm, useful products."
          highlight={["calm", "useful"]}
        />

        <div className="ab-grid mt-8 grid gap-4 sm:mt-10 lg:grid-cols-12">
          {/* Story tile */}
          <article className="ab-tile relative flex flex-col gap-7 overflow-hidden rounded-[28px] border border-paper/[0.08] bg-ink-2 p-6 sm:p-10 lg:col-span-7">
            <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-lime/10 blur-3xl" />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-10 right-4 select-none font-display text-[11rem] font-semibold leading-none tracking-[-0.06em] text-paper/[0.03]"
            >
              FB
            </span>
            <div className="relative flex items-center gap-4">
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-lime font-display text-lg font-semibold text-ink">
                FB
              </span>
              <div>
                <p className="font-display text-xl font-semibold tracking-[-0.02em] text-paper">Hi, I&rsquo;m {siteConfig.name}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-sm text-mute">
                  <MapPin size={13} aria-hidden="true" className="text-lime" />
                  {siteConfig.location}
                </p>
              </div>
            </div>
            <p className="ab-text relative font-display text-[clamp(1.05rem,1.4vw,1.25rem)] font-light leading-[1.7] tracking-[-0.01em] text-paper">
              {about.text.split(" ").map((w, i) => {
                const clean = w.replace(/[,.]$/, "");
                const isTech = TECH.has(clean);
                return (
                  <span key={i} className={`ab-word ${isTech ? "text-lime" : ""}`}>
                    {w}{" "}
                  </span>
                );
              })}
            </p>
            <a
              href="#contact"
              className="group relative mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-paper px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-300 hover:bg-lime"
            >
              Let&rsquo;s work together
              <ArrowUpRight size={16} aria-hidden="true" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </article>

          {/* Right column */}
          <div className="flex flex-col gap-4 lg:col-span-5">
            {current && (
              <div className="ab-tile relative overflow-hidden rounded-[28px] border border-lime/25 bg-gradient-to-br from-lime/[0.14] via-ink-2 to-ink-2 p-6 sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <p className="eyebrow text-lime">Currently</p>
                  <span className="inline-flex items-center gap-2 rounded-full border border-paper/15 bg-ink/60 px-3 py-1 text-xs text-paper/80">
                    <span className="relative flex h-2 w-2" aria-hidden="true">
                      <span className="pulse-ring absolute inline-flex h-full w-full rounded-full bg-lime" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
                    </span>
                    Open to work
                  </span>
                </div>
                <p className="mt-5 font-display text-2xl font-semibold tracking-[-0.02em] text-paper">{current.role}</p>
                <p className="mt-1 flex items-center gap-2 text-sm text-paper/70">
                  <Briefcase size={14} aria-hidden="true" className="text-lime" />
                  {current.company}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2 text-xs">
                  {STACK.map((t) => (
                    <li
                      key={t}
                      className="rounded-full border border-paper/10 bg-ink/50 px-3 py-1.5 text-paper/80 transition-colors duration-300 hover:border-lime/50 hover:text-lime"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <dl className="ab-stats grid flex-1 grid-cols-2 gap-4">
              {stats.map((s, i) => {
                const Icon = STAT_ICONS[i % STAT_ICONS.length];
                const featured = i === 0;
                return (
                  <div
                    key={s.label}
                    onPointerMove={(e) => {
                      const r = e.currentTarget.getBoundingClientRect();
                      e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                      e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                    }}
                    className={`ab-tile ab-stat group relative isolate overflow-hidden flex flex-col justify-between gap-5 rounded-[22px] border p-5 transition-all duration-300 hover:-translate-y-1.5 ${
                      featured ? "border-lime bg-lime text-ink hover:shadow-[0_18px_40px_-14px_rgba(198,255,61,0.7)]" : "border-paper/[0.08] bg-ink-2 text-paper hover:border-lime/40 hover:shadow-[0_18px_40px_-18px_rgba(198,255,61,0.45)]"
                    }`}
                  >
                    {/* cursor spotlight */}
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                        featured
                          ? "bg-[radial-gradient(180px_circle_at_var(--mx)_var(--my),rgba(255,255,255,0.45),transparent_70%)]"
                          : "bg-[radial-gradient(180px_circle_at_var(--mx)_var(--my),rgba(198,255,61,0.16),transparent_70%)]"
                      }`}
                    />
                    {/* shine sweep */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-[left,opacity] duration-700 ease-out group-hover:left-[120%] group-hover:opacity-100"
                    />
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-xl transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110 ${
                        featured ? "bg-ink text-lime" : "bg-ink-3 text-lime"
                      }`}
                      aria-hidden="true"
                    >
                      <Icon size={16} />
                    </span>
                    <div className="flex flex-col-reverse">
                      <dt className={`eyebrow mt-1.5 ${featured ? "text-ink/70" : "text-mute"}`}>{s.label}</dt>
                      <dd className="font-display text-[clamp(1.2rem,1.6vw,1.5rem)] leading-none tracking-[-0.03em]">
                        {typeof s.count === "number" ? <span data-count={s.count}>{s.count}</span> : s.value}
                      </dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
