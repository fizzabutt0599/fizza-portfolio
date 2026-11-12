"use client";

import { useRef } from "react";
import { Code2, Database, ShoppingBag, Wrench, type LucideIcon } from "lucide-react";
import { skillGroups } from "@/data/portfolio";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { SectionHeading } from "@/components/ui/SectionHeading";

const icons: LucideIcon[] = [Code2, Database, ShoppingBag, Wrench];

function MarqueeRow({ items, reverse, duration }: { items: string[]; reverse?: boolean; duration: string }) {
  const content = (
    <>
      {items.map((s) => (
        <span key={s} className="flex items-center gap-8 pr-8">
          <span>{s}</span>
          <span className="text-lime" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </>
  );
  return (
    <div
      className={`marquee flex overflow-hidden whitespace-nowrap ${reverse ? "marquee-reverse" : ""}`}
      style={{ ["--marquee-duration" as string]: duration }}
      aria-hidden="true"
    >
      <div className="marquee-track flex shrink-0 will-change-transform">
        <div className="flex shrink-0">{content}</div>
        <div className="flex shrink-0">{content}</div>
      </div>
    </div>
  );
}

export function Skills() {
  const rootRef = useRef<HTMLElement>(null);
  const all = skillGroups.flatMap((g) => g.skills);
  const half = Math.ceil(all.length / 2);

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".skill-card").forEach((card) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 92%", once: true } });
        tl.fromTo(card, { y: 60, opacity: 0, scale: 0.96, clipPath: "inset(18% 0% 0% 0% round 28px)" }, { y: 0, opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0% round 28px)", duration: 1.1, ease: "expo.out", clearProps: "clipPath,scale" }).from(
          card.querySelectorAll(".skill-pill"),
          { y: 16, opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.035, ease: "back.out(2)", clearProps: "all" },
          0.25,
        );
      });
      gsap.fromTo(
        ".skills-marquee",
        { xPercent: 4 },
        {
          xPercent: -4,
          ease: "none",
          scrollTrigger: { trigger: ".skills-marquee", start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="skills" ref={rootRef} aria-labelledby="skills-heading" className="relative overflow-hidden bg-ink py-10 sm:py-14">
      <div className="container-x">
        <SectionHeading
          id="skills-heading"
          index="04"
          eyebrow="Toolkit"
          title="Technical skills I reach for."
          highlight={["skills"]}
        />
      </div>

      <div className="skills-marquee my-10 space-y-3 font-display text-[clamp(1.75rem,3.6vw,3.2rem)] font-light tracking-[-0.03em] sm:my-14">
        <MarqueeRow items={all.slice(0, half)} duration="55s" />
        <div className="text-transparent [-webkit-text-stroke:1px_rgba(243,239,230,0.35)]">
          <MarqueeRow items={all.slice(half)} duration="60s" reverse />
        </div>
      </div>

      <div className="container-x grid gap-4 md:grid-cols-2">
        {skillGroups.map((group, i) => {
          const Icon = icons[i % icons.length];
          return (
            <article
              key={group.title}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
              className="skill-card hover:-translate-y-1.5 group relative overflow-hidden rounded-[28px] border border-paper/[0.08] bg-ink-2 p-6 transition-[border-color,box-shadow,background-color,translate] duration-500 hover:border-lime/40 hover:bg-lime/[0.05] hover:shadow-[0_0_0_1px_rgba(198,255,61,0.08),0_20px_60px_-20px_rgba(198,255,61,0.35),inset_0_1px_0_rgba(255,255,255,0.08)] focus-within:border-lime/50 sm:p-8"
            >
              {/* Green glass layer */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-lime/[0.14] via-lime/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              {/* Cursor spotlight */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: "radial-gradient(380px circle at var(--mx, 50%) var(--my, 50%), rgba(198,255,61,0.16), transparent 60%)" }}
              />
              {/* Shine sweep */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-0 transition-all duration-1000 ease-out group-hover:left-[120%] group-hover:opacity-100"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-lime/20 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
              />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <span className="eyebrow text-mute">0{i + 1} · {group.skills.length} skills</span>
                  <h3 className="mt-2 font-display text-xl font-normal tracking-tight text-white sm:text-2xl">{group.title}</h3>
                  <p className="mt-2 max-w-sm text-sm text-paper/60">{group.blurb}</p>
                </div>
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-ink-3 text-lime transition-all duration-500 group-hover:-rotate-12 group-hover:bg-lime group-hover:text-ink group-hover:shadow-[0_0_24px_rgba(198,255,61,0.45)]">
                  <Icon size={22} aria-hidden="true" />
                </span>
              </div>
              <ul className="relative mt-8 flex flex-wrap gap-2" aria-label={`${group.title} skills`}>
                {group.skills.map((s) => (
                  <li
                    key={s}
                    className="skill-pill rounded-full border border-paper/12 bg-ink/70 px-4 py-2 group-hover:border-lime/25 text-sm text-paper/85 transition-all duration-300 hover:-translate-y-0.5 hover:border-lime hover:bg-lime hover:text-ink"
                  >
                    {s}
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </section>
  );
}
