"use client";

import { Fragment, useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import { hero, navItems, siteConfig, skillGroups } from "@/data/portfolio";
import { useApp } from "@/components/providers/AppProvider";
import { gsap, isLowPowerDevice, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { Magnetic } from "@/components/ui/Magnetic";

/** Dotted pixel "signal" icon that sits inside the heading. */
function PixelIcon() {
  // [col, row] cells of a small zig-zag signal on a 7×5 grid
  const cells = [
    [0, 2], [1, 1], [2, 0], [2, 2], [3, 1], [3, 3], [4, 2], [4, 4], [5, 3], [6, 2], [1, 3], [5, 1],
  ];
  return (
    <svg aria-hidden="true" viewBox="0 0 70 50" className="inline-block h-[0.55em] w-[0.8em] align-middle">
      {cells.map(([c, r], i) => (
        <rect
          key={i}
          className="hero-pixel"
          x={c * 10 + 2}
          y={r * 10 + 2}
          width="6"
          height="6"
          rx="1"
          fill="#c6ff3d"
          style={{ animationDelay: `${(i % 6) * 0.12}s` }}
        />
      ))}
    </svg>
  );
}

/** Thin lines converging toward the centre. Each draws in, then short glowing streaks travel along them. */
const TUNNEL_YS = [40, 110, 175, 235, 290, 340, 385, 425, 462, 498, 532, 566, 598];
// [line index, delay (s), duration (s)] — varied so streaks never move in lockstep
const STREAKS: [number, number, number][] = [
  [1, 0.2, 3.4], [3, 1.6, 2.8], [5, 0.9, 3.8], [7, 2.4, 3.1], [9, 0.5, 2.6], [11, 3.0, 3.6],
];

function TunnelLines({ side }: { side: "left" | "right" }) {
  const flip = side === "right";
  const endY = (y: number) => 320 + (y - 320) * 0.45;
  return (
    <div className={`absolute top-0 h-full w-[28%] [mask-image:linear-gradient(to_right,black_75%,transparent)] ${flip ? "right-0 -scale-x-100" : "left-0"}`} aria-hidden="true">
      <svg viewBox="0 0 400 600" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`tl-fade-${side}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#d9f5c4" stopOpacity="0.12" />
            <stop offset="1" stopColor="#d9f5c4" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {TUNNEL_YS.map((y) => (
          <line
            key={y}
            className="hero-line"
            x1="0"
            y1={y}
            x2="400"
            y2={endY(y)}
            pathLength={100}
            strokeDasharray="100"
            stroke={`url(#tl-fade-${side})`}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {STREAKS.map(([i, delay, dur]) => (
          <line
            key={`s${i}`}
            className="hero-pulse"
            x1="0"
            y1={TUNNEL_YS[i]}
            x2="400"
            y2={endY(TUNNEL_YS[i])}
            pathLength={100}
            stroke="#c6ff3d"
            strokeWidth="1.6"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{
              animationDelay: `${delay + (flip ? 0.7 : 0)}s`,
              animationDuration: `${dur}s`,
              filter: "drop-shadow(0 0 6px #c6ff3d) drop-shadow(0 0 2px #e9ffb0)",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

const DUST = [
  [8, 12], [22, 6], [37, 18], [63, 9], [78, 15], [91, 7], [14, 88], [31, 94], [70, 91], [86, 84], [52, 4], [96, 46],
];

export function Hero() {
  const { isReady, scrollTo } = useApp();
  const rootRef = useRef<HTMLElement>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const pillars = skillGroups.slice(0, 3);

  const words = hero.heading.split(" ");
  const iconAfter = words.findIndex((w) => w.toLowerCase() === "build");

  // Hide animated elements before first paint (the preloader covers the screen meanwhile)
  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current) return;
    if (prefersReducedMotion()) {
      rootRef.current.classList.add("hero-live");
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(".hero-word", { autoAlpha: 0, filter: "blur(14px)", y: 14 });
      gsap.set(".hero-fade", { autoAlpha: 0, y: 10 });
      gsap.set(".hero-pillar", { autoAlpha: 0, y: 24, filter: "blur(8px)" });
      gsap.set(".hero-bottomnav", { autoAlpha: 0, y: 30 });
      gsap.set(".hero-frame", { autoAlpha: 0 });
      gsap.set(".hero-beam", { autoAlpha: 0 });
      gsap.set(".hero-line", { attr: { "stroke-dashoffset": 100 } });
      gsap.set(".hero-roles-glow", { autoAlpha: 0, scale: 0.6 });
      gsap.set(".hero-pillar-num", { color: "rgba(243,239,230,0.4)" });
    }, rootRef);
    ctxRef.current = ctx;
    return () => {
      ctx.revert();
      ctxRef.current = null;
    };
  }, []);

  // Entrance once the preloader has finished
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!isReady || !ctx || !rootRef.current) return;

    ctx.add(() => {
      const tl = gsap.timeline({ delay: 0.05 });
      // 1) stage + light come up, heading blurs in word by word
      tl.to(".hero-frame", { autoAlpha: 1, duration: 0.6, ease: "power2.out" }, 0)
        .to(".hero-beam", { autoAlpha: 1, duration: 1.2, stagger: 0.12, ease: "power2.out" }, 0)
        .to(".hero-fade", { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" }, 0.15)
        .to(".hero-word", { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 0.85, stagger: 0.07, ease: "power3.out" }, 0.25)
        // 2) tunnel lines draw in from the edges, one after another
        .addLabel("lines", "-=0.2")
        .to(".hero-line", { attr: { "stroke-dashoffset": 0 }, duration: 1.1, stagger: { each: 0.05, from: "random" }, ease: "power2.inOut" }, "lines")
        .add(() => rootRef.current?.classList.add("hero-live"), "lines+=0.9")
        // 3) a soft spotlight opens behind the roles, then each role lights up in turn
        .to(".hero-roles-glow", { autoAlpha: 1, scale: 1, duration: 1.2, ease: "expo.out" }, "lines+=0.8")
        .to(".hero-pillar", { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.8, stagger: 0.18, ease: "power3.out" }, "lines+=0.9")
                .to(".hero-bottomnav", { autoAlpha: 1, y: 0, duration: 0.7, ease: "expo.out" }, "-=0.2")
        .set(".hero-word, .hero-pillar", { clearProps: "filter" });

      gsap.fromTo(".hero-inner", { yPercent: 0, autoAlpha: 1 }, {
        yPercent: -6,
        autoAlpha: 0.35,
        ease: "none",
        scrollTrigger: { trigger: rootRef.current, start: "top top", end: "bottom top", scrub: true },
      });
    });
  }, [isReady]);

  // Beams sway slightly with the pointer (desktop only)
  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion() || isLowPowerDevice()) return;
    const beams = root.querySelector<HTMLElement>(".hero-beams");
    if (!beams) return;
    const xTo = gsap.quickTo(beams, "x", { duration: 1.6, ease: "power3.out" });
    const onMove = (e: PointerEvent) => xTo((e.clientX / window.innerWidth - 0.5) * 50);
    root.addEventListener("pointermove", onMove);
    return () => {
      root.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(beams);
    };
  }, []);

  const jump = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollTo(id === "home" ? 0 : `#${id}`, { offset: id === "home" ? 0 : -20 });
  };

  return (
    <section
      id="home"
      ref={rootRef}
      aria-labelledby="hero-heading"
      className="relative isolate overflow-clip bg-[#040605] px-2 pb-6 pt-20 sm:px-3 lg:pt-3"
    >
      {/* light shafts from above */}
      <div aria-hidden="true" className="hero-beams pointer-events-none absolute inset-x-0 top-0 -z-10 h-[75%]">
        <div className="hero-beam hero-sway absolute left-[calc(50%-5rem)] top-[-10%] h-full w-[10rem] origin-top bg-gradient-to-b from-lime/15 via-lime/[0.03] to-transparent blur-2xl" />
        <div className="hero-beam hero-sway-l absolute will-change-transform left-[22%] top-[-10%] h-[80%] w-[16rem] origin-top bg-gradient-to-b from-[#3f8f1a]/15 via-[#2b5e12]/[0.03] to-transparent blur-3xl" />
        <div className="hero-beam hero-sway-r absolute will-change-transform right-[20%] top-[-10%] h-[80%] w-[16rem] origin-top bg-gradient-to-b from-[#3f8f1a]/15 via-[#2b5e12]/[0.03] to-transparent blur-3xl" />
      </div>
      {/* floating dust */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        {DUST.map(([x, y], i) => (
          <span key={i} className="absolute h-[3px] w-[3px] rounded-full bg-paper/25" style={{ left: `${x}%`, top: `${y}%` }} />
        ))}
      </div>

      {/* Framed stage */}
      <div className="hero-frame relative w-full overflow-hidden rounded-[1.75rem] border border-paper/[0.05] bg-[radial-gradient(60%_55%_at_50%_45%,#0f1a10_0%,#070a08_60%,#050706_100%)] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.04)] sm:rounded-[2rem]">
        <div className="hero-tunnel pointer-events-none absolute inset-x-0 bottom-[4%] top-[34%]">
          <TunnelLines side="left" />
          <TunnelLines side="right" />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 h-40 w-[30rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime/[0.07] blur-3xl" />

        <div className="hero-inner relative z-10 flex min-h-[calc(100svh-6rem)] flex-col px-5 py-6 sm:px-8 lg:min-h-[calc(100svh-1.5rem)]">
          {/* top bar inside the frame (desktop; mobile uses the fixed navbar) */}
          <div className="hero-fade hidden items-center justify-between lg:flex">
            <a href="#home" onClick={jump("home")} className="flex items-center gap-2.5 rounded-full">
              <span className="grid h-8 w-8 place-items-center rounded-lg border border-lime/40 bg-lime/10 font-display text-xs font-bold text-lime">
                {siteConfig.initials}
              </span>
              <span className="font-display text-base font-semibold tracking-tight">{siteConfig.name}</span>
            </a>
            <div className="flex items-center gap-5">
              <span className="hidden items-center gap-2 text-xs text-paper/60 xl:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_8px_#c6ff3d]" aria-hidden="true" />
                {hero.badge}
              </span>
              <Magnetic>
                <a
                  href="#contact"
                  onClick={jump("contact")}
                  className="group inline-flex items-center gap-3 rounded-full border border-lime/30 bg-ink/60 py-1.5 pl-5 pr-1.5 text-sm text-paper shadow-[0_0_24px_-8px_rgba(198,255,61,0.6)] transition-colors hover:border-lime"
                >
                  Let’s Talk
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-lime text-ink shadow-[0_0_16px_rgba(198,255,61,0.7)] transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </span>
                </a>
              </Magnetic>
            </div>
          </div>

          {/* headline block */}
          <div className="flex flex-1 flex-col items-center justify-center pt-10 text-center lg:pt-0">
            <span className="hero-fade mb-6 inline-flex items-center gap-2 rounded-full border border-lime/20 bg-lime/[0.05] px-3 py-1.5 text-xs text-paper/75 lg:hidden">
              <span className="h-1.5 w-1.5 rounded-full bg-lime" aria-hidden="true" />
              {hero.badge}
            </span>
            <h1
              id="hero-heading"
              className="max-w-[17ch] text-balance font-display text-[clamp(2.4rem,5.2vw,4.8rem)] font-light leading-[1.02] tracking-[-0.05em] text-white"
            >
              {words.map((w, i) => (
                <Fragment key={`${w}-${i}`}>
                  <span className="hero-word inline-block">{w}</span>
                  {i === iconAfter && (
                    <>
                      {" "}
                      <span className="hero-word inline-block">
                        <PixelIcon />
                      </span>
                    </>
                  )}
                  {i < words.length - 1 && " "}
                </Fragment>
              ))}
            </h1>
            <p className="hero-fade mt-6 max-w-[34rem] text-[13px] leading-relaxed text-paper/60">
              {hero.intro}
            </p>

            <div className="relative mt-14 w-full max-w-6xl sm:mt-24">
              <div
                aria-hidden="true"
                className="hero-roles-glow pointer-events-none absolute left-1/2 top-1/2 h-[16rem] w-[min(90%,52rem)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(126,200,60,0.08),rgba(126,200,60,0.02)_60%,transparent)] blur-xl"
              />
              <ul className="relative grid gap-10 sm:grid-cols-3 sm:gap-10">
                {pillars.map((p, i) => (
                  <li
                    key={p.title}
                    className="hero-pillar group flex flex-col items-center px-4"
                  >
                    <span className="hero-pillar-num font-mono text-[10px] tracking-[0.2em] text-paper/40">
                      [ {String(i + 1).padStart(2, "0")} ]
                    </span>
                    <h2 className="mt-3 font-display text-xl font-light tracking-[-0.03em] text-white transition-colors duration-300 group-hover:text-lime sm:text-2xl">
                      {p.title}
                    </h2>
                    <p className="mt-3 max-w-[30ch] text-[13px] leading-relaxed text-paper/55">{p.blurb}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* floating pill nav at the bottom of the frame (desktop) */}
          <nav aria-label="Hero" className="hero-bottomnav mt-10 hidden justify-center lg:flex">
            <ul className="flex items-center gap-1 rounded-2xl border border-lime/20 bg-gradient-to-b from-lime/[0.10] to-[#0b1a0b]/40 p-1.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8),0_0_40px_-12px_rgba(198,255,61,0.35),inset_0_1px_0_rgba(198,255,61,0.18)] backdrop-blur-xl backdrop-saturate-150">
              {navItems.map((item) => {
                const isHome = item.id === "home";
                return (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={jump(item.id)}
                      aria-current={isHome ? "location" : undefined}
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors duration-300 ${
                        isHome ? "border border-lime/30 bg-lime/[0.14] text-white shadow-[inset_0_1px_0_rgba(198,255,61,0.25),0_0_18px_-6px_rgba(198,255,61,0.6)]" : "border border-transparent text-paper/65 hover:bg-lime/[0.08] hover:text-lime"
                      }`}
                    >
                      {isHome && <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_8px_#c6ff3d]" aria-hidden="true" />}
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
