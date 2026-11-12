"use client";

import { useRef } from "react";
import { Briefcase } from "lucide-react";
import { experiences } from "@/data/portfolio";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function Experience() {
  const rootRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Progress line grows with scroll (transform only → cheap on mobile)
      gsap.fromTo(
        ".tl-progress",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".tl-list", start: "top 70%", end: "bottom 60%", scrub: 0.5 },
        },
      );
      gsap.from(".tl-head > *", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        scrollTrigger: { trigger: ".tl-list", start: "top 80%", once: true },
      });
      const items = gsap.utils.toArray<HTMLElement>(".tl-item");
      const countEl = rootRef.current!.querySelector<HTMLElement>(".tl-count");
      const barEl = rootRef.current!.querySelector<HTMLElement>(".tl-count-bar");
      const setActive = (n: number) => {
        if (countEl) countEl.textContent = String(n).padStart(2, "0");
        if (barEl) gsap.to(barEl, { scaleX: n / items.length, duration: 0.4, ease: "power2.out" });
        items.forEach((el, idx) => {
          el.classList.toggle("is-active", idx === n - 1);
          el.classList.toggle("is-done", idx < n);
        });
      };
      items.forEach((item, idx) => {
        gsap.from(item, {
          x: -24,
          opacity: 0,
          duration: 0.9,
          scrollTrigger: { trigger: item, start: "top 88%", once: true },
        });
        ScrollTrigger.create({
          trigger: item,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => setActive(idx + 1),
          onEnterBack: () => setActive(idx + 1),
        });
      });
      items.forEach((item) => {
        gsap.fromTo(
          item.querySelector(".tl-dot"),
          { scale: 0.4, backgroundColor: "#2a2a2f" },
          {
            scale: 1,
            backgroundColor: "#c6ff3d",
            duration: 0.5,
            scrollTrigger: { trigger: item, start: "top 65%", toggleActions: "play none none reverse" },
          },
        );
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" ref={rootRef} aria-labelledby="experience-heading" className="relative bg-ink py-10 sm:py-14">
      <div className="container-x">
        <SectionHeading
          id="experience-heading"
          index="02"
          eyebrow="Experience"
          title="Where I ship real work, every day."
          highlight={["real", "work"]}
        />

        {experiences.map((exp) => (
          <article key={exp.company} className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-12">
            <header className="tl-head lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
              <span className="inline-flex items-center gap-2 rounded-full border border-lime/40 bg-lime/10 px-3 py-1.5 text-xs font-medium text-lime">
                <span className="h-1.5 w-1.5 rounded-full bg-lime" aria-hidden="true" />
                {exp.period}
              </span>
              <h3 className="mt-6 font-display text-2xl font-normal tracking-tight text-white sm:text-3xl">{exp.role}</h3>
              <p className="mt-3 inline-flex items-center gap-2 text-base text-paper/80">
                <Briefcase size={18} aria-hidden="true" className="text-lime" />
                {exp.company}
              </p>
              <p className="mt-1 text-sm text-mute">{exp.location}</p>
              <div className="mt-10 hidden lg:block" aria-hidden="true">
                <div className="flex items-end gap-2 font-display leading-none">
                  <span className="tl-count text-[5.5rem] font-semibold tracking-[-0.05em] text-lime">01</span>
                  <span className="mb-3 text-xl text-mute">/ {String(exp.responsibilities.length).padStart(2, "0")}</span>
                </div>
                <div className="mt-4 h-[3px] w-full max-w-[220px] overflow-hidden rounded-full bg-paper/10">
                  <div
                    className="tl-count-bar h-full w-full origin-left rounded-full bg-gradient-to-r from-lime to-violet"
                    style={{ transform: `scaleX(${1 / exp.responsibilities.length})` }}
                  />
                </div>
                <p className="eyebrow mt-3 text-mute">Responsibilities</p>
              </div>
            </header>

            <div className="relative lg:col-span-8">
              <div className="absolute bottom-2 left-[7px] top-2 w-px bg-line" aria-hidden="true">
                <div className="tl-progress h-full w-full origin-top bg-gradient-to-b from-lime to-violet" />
              </div>
              <ol className="tl-list space-y-3" aria-label={`Responsibilities at ${exp.company}`}>
                {exp.responsibilities.map((r, i) => (
                  <li key={r} className="tl-item group/item relative pl-10">
                    <span className="tl-dot absolute left-0 top-6 h-[15px] w-[15px] rounded-full border-[3px] border-ink bg-lime" aria-hidden="true" />
                    <div className="relative overflow-hidden rounded-2xl border border-paper/[0.07] bg-ink-2 p-5 transition-all duration-700 ease-out hover:border-lime/30 group-[.is-done]/item:border-lime/35 group-[.is-done]/item:bg-lime/[0.09] group-[.is-done]/item:shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] group-[.is-active]/item:border-lime/50 group-[.is-active]/item:bg-lime/[0.1] group-[.is-active]/item:shadow-[0_18px_50px_-24px_rgba(198,255,61,0.55),inset_0_1px_0_rgba(255,255,255,0.08)] hover:bg-ink-3 sm:p-6">
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-lime/[0.18] via-lime/[0.04] to-transparent opacity-0 transition-opacity duration-700 group-[.is-done]/item:opacity-100"
                      />
                      <span className="eyebrow relative text-mute transition-colors duration-500 group-[.is-done]/item:text-lime">{String(i + 1).padStart(2, "0")}</span>
                      <p className="relative mt-2 text-sm leading-relaxed text-paper/75 transition-colors duration-500 group-[.is-done]/item:text-paper sm:text-base">{r}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
