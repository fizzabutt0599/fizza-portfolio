"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { navItems, siteConfig, socialLinks } from "@/data/portfolio";
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
      gsap.from(".ft-fade", {
        y: 30,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 85%", once: true },
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

  const jump = (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollTo(id === "home" ? 0 : `#${id}`, { offset: id === "home" ? 0 : -20 });
  };

  const linkCls =
    "group inline-flex items-center gap-2.5 text-paper/75 transition-colors duration-300 hover:text-lime";
  const underline =
    "bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]";

  return (
    <footer ref={rootRef} className="relative overflow-hidden border-t border-paper/10 bg-ink pt-16 sm:pt-24">
      {/* soft lime light rising from the bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[-30%] left-1/2 h-[30rem] w-[60rem] max-w-[120%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(198,255,61,0.14),transparent)] blur-2xl"
      />
      <div className="container-x relative">
        {/* CTA + back to top */}
        <div className="ft-fade flex flex-col gap-10 border-b border-paper/10 pb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow inline-flex items-center gap-2 text-lime">
              <span className="h-1.5 w-1.5 rounded-full bg-lime shadow-[0_0_8px_#c6ff3d]" aria-hidden="true" />
              Available for new projects
            </p>
            <h2 className="mt-5 max-w-[16ch] font-display text-[clamp(2rem,4.6vw,4rem)] font-light leading-[1.02] tracking-[-0.04em] text-white">
              Got an idea? <span className="font-serif italic text-lime">Let’s talk.</span>
            </h2>
            <a
              href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(siteConfig.email)}&su=${encodeURIComponent("Project enquiry")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-7 inline-flex items-center gap-3 rounded-full border border-lime/30 bg-lime/[0.06] py-2 pl-5 pr-2 text-paper transition-colors duration-300 hover:border-lime hover:bg-lime hover:text-ink"
            >
              {siteConfig.email}
              <span className="grid h-9 w-9 place-items-center rounded-full bg-lime text-ink transition-transform duration-300 group-hover:rotate-45 group-hover:bg-ink group-hover:text-lime">
                <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </a>
          </div>

          <Magnetic strength={0.5}>
            <button
              type="button"
              onClick={backToTop}
              className="group relative grid h-28 w-28 shrink-0 place-items-center rounded-full border border-paper/15 text-center text-xs uppercase transition-colors duration-500 hover:border-lime hover:bg-lime hover:text-ink"
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

        {/* link columns */}
        <div className="ft-fade grid grid-cols-2 gap-10 py-12 sm:grid-cols-3">
          <div>
            <p className="eyebrow text-mute">Navigate</p>
            <ul className="mt-5 space-y-3">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} onClick={jump(item.id)} className={linkCls}>
                    <span className={underline}>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-mute">Elsewhere</p>
            <ul className="mt-5 space-y-3">
              {socialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target={s.label === "Email" ? undefined : "_blank"}
                    rel={s.label === "Email" ? undefined : "noopener noreferrer"}
                    className={linkCls}
                  >
                    <SocialIcon label={s.label} size={16} />
                    <span className={underline}>{s.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 sm:col-span-1">
            <p className="eyebrow text-mute">Based in</p>
            <p className="mt-5 text-paper/75">{siteConfig.location}</p>
            <p className="mt-1 text-paper/50">Open to remote work worldwide</p>
          </div>
        </div>

        <p
          className="ft-name overflow-hidden whitespace-nowrap bg-gradient-to-b from-paper to-paper/10 bg-clip-text text-center font-display text-[clamp(3rem,15vw,14rem)] font-medium leading-[0.85] tracking-[-0.06em] text-transparent"
          aria-hidden="true"
        >
          {siteConfig.name.split("").map((l, i) => (
            <span key={i} className="ft-letter inline-block bg-gradient-to-b from-paper to-paper/10 bg-clip-text">
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
