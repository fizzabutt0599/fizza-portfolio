"use client";

import { useRef } from "react";
import { Award, CalendarDays, GraduationCap, type LucideIcon } from "lucide-react";
import { certifications, education } from "@/data/portfolio";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface Entry {
  kind: "Education" | "Training";
  title: string;
  org: string;
  period: string;
  icon: LucideIcon;
}

export function Education() {
  const rootRef = useRef<HTMLElement>(null);

  const degree = education[0];
  const trainings: Entry[] = certifications.map((c) => ({
    kind: "Training",
    title: c.title,
    org: c.issuer,
    period: c.period,
    icon: Award,
  }));

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: ".edu-grid", start: "top 80%", once: true } });
      tl.from(".edu-card", { y: 40, opacity: 0, duration: 0.8, stagger: 0.12, ease: "power3.out" })
        .fromTo(".edu-track", { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: "expo.inOut" }, 0.3)
        .from(".edu-dot", { scale: 0, duration: 0.4, stagger: 0.15, ease: "back.out(3)" }, 0.6);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="education"
      ref={rootRef}
      aria-labelledby="education-heading"
      className="relative overflow-hidden bg-ink py-10 sm:py-14"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/3 h-[30rem] w-[50rem] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(126,200,60,0.12),transparent)] blur-2xl"
      />
      <div className="container-x relative">
        <SectionHeading
          id="education-heading"
          index="05"
          eyebrow="Education & Training"
          title="Always learning, always building."
          highlight={["learning", "building"]}
        />

        <div className="edu-grid mt-8 grid gap-4 sm:mt-10 lg:grid-cols-12">
          {/* Degree: featured card */}
          {degree && (
            <article className="edu-card group relative flex flex-col justify-between gap-12 overflow-hidden rounded-[28px] border border-lime/20 bg-gradient-to-br from-[#12210d] via-ink-2 to-ink-2 p-6 transition-colors duration-500 hover:border-lime/50 sm:p-10 lg:col-span-7 lg:row-span-2">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-lime/15 blur-3xl transition-opacity duration-700 group-hover:opacity-100 lg:opacity-60"
              />
              <div className="relative flex items-start justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/10 px-3 py-1.5 text-xs font-medium text-lime">
                  <GraduationCap size={14} aria-hidden="true" />
                  Education
                </span>
                <span className="font-mono text-[11px] tracking-[0.25em] text-paper/40">[ 01 ]</span>
              </div>

              <div className="relative">
                <p className="text-sm text-paper/60">{degree.institution}</p>
                <h3 className="mt-3 max-w-xl font-display text-2xl font-normal leading-tight tracking-tight text-white sm:text-3xl">
                  {degree.degree}
                </h3>
              </div>

              {/* year track */}
              <div className="relative">
                <div className="flex items-center justify-between text-xs text-paper/60">
                  {degree.period.split(/\s*[–-]\s*/).map((y) => (
                    <span key={y} className="font-mono tracking-wider">
                      {y}
                    </span>
                  ))}
                </div>
                <div className="relative mt-3 h-px bg-paper/10">
                  <div className="edu-track absolute inset-0 origin-left bg-gradient-to-r from-lime/40 to-lime shadow-[0_0_10px_rgba(198,255,61,0.6)]" />
                  <span className="edu-dot absolute -top-[5px] left-0 h-[11px] w-[11px] rounded-full border-2 border-ink bg-lime" />
                  <span className="edu-dot absolute -top-[5px] right-0 h-[11px] w-[11px] rounded-full border-2 border-ink bg-lime shadow-[0_0_12px_#c6ff3d]" />
                </div>
              </div>
            </article>
          )}

          {/* Trainings */}
          {trainings.map((t, i) => {
            const Icon = t.icon;
            return (
              <article
                key={t.title}
                className="edu-card group relative flex flex-col gap-6 overflow-hidden rounded-[28px] border border-paper/[0.08] bg-ink-2 p-6 transition-colors duration-500 hover:border-lime/40 sm:p-8 lg:col-span-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink-3 text-lime transition-transform duration-500 group-hover:-rotate-12">
                    <Icon size={20} aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.25em] text-paper/40">
                    [ {String(i + 2).padStart(2, "0")} ]
                  </span>
                </div>
                <div>
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-lime">{t.kind}</span>
                  <h3 className="mt-2 font-display text-xl font-normal leading-snug tracking-tight text-white transition-colors duration-300 group-hover:text-lime sm:text-2xl">
                    {t.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper/65">{t.org}</p>
                </div>
                <p className="mt-auto inline-flex items-center gap-2 self-start rounded-full border border-paper/10 px-3 py-1.5 text-xs text-paper/70">
                  <CalendarDays size={13} aria-hidden="true" className="text-lime" />
                  {t.period}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
