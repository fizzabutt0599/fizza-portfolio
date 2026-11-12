"use client";

import { useEffect, useRef, useState } from "react";
import { skillGroups, siteConfig } from "@/data/portfolio";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * "Stack Map": a small live blueprint of how Fizza's skill areas connect.
 * Each skill group is a node wired to the FB core; data pulses travel along the links.
 * Nodes are real buttons, so the map works with mouse, touch and keyboard.
 */

const CENTER = { x: 200, y: 200 };
const POSITIONS = [
  { x: 200, y: 58 }, // top
  { x: 342, y: 200 }, // right
  { x: 200, y: 342 }, // bottom
  { x: 58, y: 200 }, // left
];
const SHORT: Record<string, string> = {
  Frontend: "Frontend",
  Backend: "Backend",
  "WordPress & E-commerce": "WordPress",
  "Tools & Deployment": "Deploy",
};

export function StackMap({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(false);
  const groups = skillGroups.slice(0, POSITIONS.length);

  // Pulses travelling core → node → core (attr tweens, no paid plugins)
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<SVGCircleElement>(".sm-pulse").forEach((dot, i) => {
        const p = POSITIONS[i];
        gsap.fromTo(
          dot,
          { attr: { cx: CENTER.x, cy: CENTER.y }, opacity: 0 },
          {
            keyframes: [
              { opacity: 1, duration: 0.15 },
              { attr: { cx: p.x, cy: p.y }, duration: 1.3, ease: "power1.inOut" },
              { opacity: 0, duration: 0.2 },
            ],
            repeat: -1,
            repeatDelay: 1.2,
            delay: i * 0.6,
          },
        );
      });
      gsap.to(".sm-orbit", { rotate: 360, transformOrigin: "50% 50%", duration: 60, ease: "none", repeat: -1 });
    }, root);
    return () => ctx.revert();
  }, []);

  // Gently cycle through nodes until the visitor takes over
  useEffect(() => {
    if (pinned || prefersReducedMotion()) return;
    const id = window.setInterval(() => setActive((a) => (a + 1) % groups.length), 3200);
    return () => window.clearInterval(id);
  }, [pinned, groups.length]);

  // Draw the eye to the panel whenever the active node changes
  const panelRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        panel,
        { boxShadow: "0 0 0 1px rgba(198,255,61,0.9), 0 0 50px -6px rgba(198,255,61,0.55)" },
        { boxShadow: "0 0 0 1px rgba(198,255,61,0.25), 0 0 30px -14px rgba(198,255,61,0.35)", duration: 1.1, ease: "power2.out" },
      )
        .fromTo(".sm-beam", { scaleY: 0 }, { scaleY: 1, duration: 0.35, ease: "power2.out" }, 0)
        .fromTo(".sm-title", { yPercent: 110 }, { yPercent: 0, duration: 0.55, ease: "expo.out" }, 0.05)
        .fromTo(".sm-count", { yPercent: -110 }, { yPercent: 0, duration: 0.45, ease: "expo.out" }, 0.05)
        .fromTo(
          ".sm-pill",
          { y: 10, autoAlpha: 0, scale: 0.92 },
          { y: 0, autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.04, ease: "back.out(2)" },
          0.15,
        );
      if (!pinned) {
        tl.fromTo(".sm-timer", { scaleX: 0 }, { scaleX: 1, duration: 3.2, ease: "none" }, 0);
      } else {
        gsap.set(".sm-timer", { scaleX: 1 });
      }
    }, panel.parentElement ?? panel);
    return () => ctx.revert();
  }, [active, pinned]);

  const select = (i: number) => {
    setPinned(true);
    setActive(i);
  };

  const current = groups[active];

  return (
    <div ref={rootRef} className={className}>
      <div className="relative mx-auto aspect-square w-full max-w-[22rem]">
        <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <radialGradient id="sm-core" cx="50%" cy="50%" r="50%">
              <stop offset="0" stopColor="#c6ff3d" stopOpacity="0.35" />
              <stop offset="1" stopColor="#c6ff3d" stopOpacity="0" />
            </radialGradient>
          </defs>
          <g className="sm-orbit">
            <circle cx="200" cy="200" r="142" fill="none" stroke="#f3efe6" strokeOpacity="0.1" strokeDasharray="2 8" />
            <circle cx="342" cy="200" r="3" fill="#a78bfa" />
          </g>
          <circle cx="200" cy="200" r="90" fill="none" stroke="#f3efe6" strokeOpacity="0.06" />
          {POSITIONS.map((p, i) => (
            <line
              key={i}
              x1={CENTER.x}
              y1={CENTER.y}
              x2={p.x}
              y2={p.y}
              stroke={i === active ? "#c6ff3d" : "#f3efe6"}
              strokeOpacity={i === active ? 1 : 0.12}
              strokeWidth={i === active ? 2.5 : 1}
              strokeDasharray={i === active ? "6 6" : undefined}
              className={i === active ? "sm-flow" : undefined}
              style={{ transition: "stroke 400ms, stroke-opacity 400ms, stroke-width 400ms" }}
            />
          ))}
          {POSITIONS.map((_, i) => (
            <circle key={`p${i}`} className="sm-pulse" cx={CENTER.x} cy={CENTER.y} r="3.5" fill="#c6ff3d" opacity="0" />
          ))}
          <circle cx="200" cy="200" r="70" fill="url(#sm-core)" />
        </svg>

        {/* core */}
        <div className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-lime/50 bg-ink font-display text-xl font-bold text-lime shadow-[0_0_40px_-6px_rgba(198,255,61,0.55)]">
          {siteConfig.initials}
        </div>

        {/* nodes */}
        {groups.map((g, i) => {
          const p = POSITIONS[i];
          const isActive = i === active;
          return (
            <button
              key={g.title}
              type="button"
              onMouseEnter={() => select(i)}
              onFocus={() => select(i)}
              onClick={() => select(i)}
              aria-pressed={isActive}
              aria-controls="stack-map-panel"
              className={`absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border px-3.5 py-2 text-xs font-medium tracking-wide transition-all duration-300 ${
                isActive
                  ? "z-10 scale-110 border-lime bg-lime font-semibold text-ink shadow-[0_0_36px_-2px_rgba(198,255,61,0.75)]"
                  : "border-paper/15 bg-ink-2 text-paper/55 hover:border-lime/60 hover:text-paper"
              }`}
              style={{ left: `${(p.x / 400) * 100}%`, top: `${(p.y / 400) * 100}%` }}
            >
              {isActive && (
                <span aria-hidden="true" className="pulse-ring absolute inset-0 -z-10 rounded-full bg-lime/60" />
              )}
              {SHORT[g.title] ?? g.title}
            </button>
          );
        })}
      </div>

      {/* beam connecting the map to the panel */}
      <div aria-hidden="true" className="mx-auto flex h-6 w-px justify-center">
        <span className="sm-beam block h-full w-px origin-top bg-gradient-to-b from-lime/0 to-lime" />
      </div>

      <div
        ref={panelRef}
        id="stack-map-panel"
        aria-live="polite"
        className="relative mx-auto min-h-[8rem] max-w-[22rem] overflow-hidden rounded-2xl border border-lime/25 bg-gradient-to-b from-lime/[0.07] to-ink-2/80 p-4 shadow-[0_0_30px_-14px_rgba(198,255,61,0.35)] backdrop-blur"
      >
        {/* auto-cycle timer */}
        <span aria-hidden="true" className="sm-timer absolute inset-x-0 top-0 h-[2px] origin-left bg-lime" />
        <p className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-mute">
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-lime" aria-hidden="true" />
            Stack map
          </span>
          <span className="overflow-hidden text-lime">
            <span className="sm-count inline-block">
              {String(active + 1).padStart(2, "0")} / {String(groups.length).padStart(2, "0")}
            </span>
          </span>
        </p>
        <p className="mt-2 overflow-hidden font-display text-lg font-normal tracking-tight text-white">
          <span className="sm-title inline-block">{current.title}</span>
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`${current.title} skills`}>
          {current.skills.map((s, i) => (
            <li
              key={`${active}-${s}`}
              className={`sm-pill rounded-full border px-2.5 py-1 text-[11px] ${
                i === 0 ? "border-lime/60 bg-lime/15 text-lime" : "border-paper/15 bg-ink/40 text-paper/85"
              }`}
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
