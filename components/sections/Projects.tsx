"use client";

import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { projects } from "@/data/portfolio";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "./ProjectCard";

export function Projects() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const mm = gsap.matchMedia();

    // Large screens: pinned horizontal scroll
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const distance = () => track.scrollWidth - window.innerWidth;
      const horizontal = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: ".projects-pin",
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      gsap.from(".project-card", {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.1,
        clearProps: "transform,opacity",
        // trigger on the section (not the pinned element) so it can't be skipped by the pin
        scrollTrigger: { trigger: "#projects", start: "top 75%", once: true },
      });

      // parallax image drift + metadata stagger tied to the horizontal movement
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
        gsap.fromTo(
          card.querySelector(".project-img-wrap"),
          { xPercent: -5 },
          {
            xPercent: 5,
            ease: "none",
            scrollTrigger: { trigger: card, containerAnimation: horizontal, start: "left right", end: "right left", scrub: true },
          },
        );
        gsap.fromTo(
          card.querySelector(".project-media"),
          { clipPath: "inset(0% 0% 0% 100% round 22px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 22px)",
            duration: 1,
            ease: "expo.inOut",
            scrollTrigger: { trigger: card, containerAnimation: horizontal, start: "left 90%", once: true },
          },
        );
        gsap.from(card.querySelectorAll(".project-meta"), {
          y: 24,
          opacity: 0,
          duration: 0.8,
          stagger: 0.07,
          scrollTrigger: { trigger: card, containerAnimation: horizontal, start: "left 85%", once: true },
        });
      });

      // Keyboard users: tabbing into an off-screen card scrolls it into view
      const onFocus = (e: FocusEvent) => {
        const card = (e.target as HTMLElement).closest<HTMLElement>(".project-slide");
        const st = horizontal.scrollTrigger;
        if (!card || !st) return;
        const progress = Math.min(1, Math.max(0, (card.offsetLeft - window.innerWidth * 0.15) / distance()));
        window.scrollTo({ top: st.start + (st.end - st.start) * progress, behavior: "auto" });
      };
      track.addEventListener("focusin", onFocus);
      return () => track.removeEventListener("focusin", onFocus);
    });

    // Small screens: simple stacked reveals
    mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>(".project-card").forEach((card) => {
        const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 85%", once: true } });
        tl.fromTo(
          card.querySelector(".project-media"),
          { clipPath: "inset(0 0 100% 0 round 22px)" },
          { clipPath: "inset(0 0 0% 0 round 22px)", duration: 0.9, ease: "expo.inOut" },
        )
          .from(card.querySelector(".project-img-wrap"), { scale: 1.25, duration: 1 }, 0)
          .from(card.querySelectorAll(".project-meta"), { y: 20, opacity: 0, duration: 0.7, stagger: 0.06 }, 0.4);
      });
    });

    // Images inside the pinned area can change layout once loaded
    const imgs = Array.from(track.querySelectorAll("img"));
    const refresh = () => ScrollTrigger.refresh();
    imgs.forEach((img) => img.addEventListener("load", refresh, { once: true }));

    return () => {
      imgs.forEach((img) => img.removeEventListener("load", refresh));
      mm.revert();
    };
  }, []);

  return (
    <section id="projects" ref={rootRef} aria-labelledby="projects-heading" className="relative bg-ink">
      <div className="projects-pin relative overflow-x-clip py-10 sm:py-14 lg:flex lg:items-start lg:py-14">
        <div
          ref={trackRef}
          className="container-x flex flex-col gap-8 lg:w-max lg:max-w-none lg:flex-row lg:items-stretch lg:gap-8 lg:pr-[12vw]"
        >
          <div className="flex shrink-0 flex-col justify-between gap-10 lg:h-[min(80vh,720px)] lg:w-[30vw] lg:py-4">
            <SectionHeading
              id="projects-heading"
              index="03"
              eyebrow="Selected Work"
              title="Featured projects."
              highlight={["projects"]}
            />

            <ol className="hidden flex-col border-t border-paper/[0.08] lg:flex" aria-label="Project list">
              {projects.map((p) => (
                <li key={p.slug} className="border-b border-paper/[0.08]">
                  <a
                    href={`/projects/${p.slug}`}
                    className="group flex items-center gap-5 py-4 transition-colors duration-300 hover:text-lime"
                  >
                    <span className="font-display text-sm text-lime">{p.index}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-display text-lg text-paper transition-colors duration-300 group-hover:text-lime">
                        {p.shortTitle}
                      </span>
                      <span className="eyebrow mt-1 block text-mute">
                        {p.category} · {p.year}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={18}
                      aria-hidden="true"
                      className="shrink-0 text-mute transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-lime"
                    />
                  </a>
                </li>
              ))}
            </ol>

            <div className="flex flex-col gap-5">
              <p className="max-w-sm text-paper/65">
                A few things I&rsquo;ve designed and built recently &mdash; from interactive government data maps to real-time AI.
              </p>
              <div className="hidden items-center gap-3 lg:flex" aria-hidden="true">
                <span className="relative h-px w-16 overflow-hidden bg-paper/15">
                  <span className="absolute inset-y-0 left-0 w-1/2 animate-[scrollhint_1.8s_ease-in-out_infinite] bg-lime" />
                </span>
                <span className="eyebrow text-mute">Scroll to explore</span>
                <ArrowRight size={14} className="text-lime" />
              </div>
            </div>
          </div>

          {projects.map((p, i) => (
            <div key={p.slug} className="project-slide shrink-0 lg:h-[min(80vh,720px)] lg:w-[min(44vw,680px)]">
              <ProjectCard project={p} priority={i === 0} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
