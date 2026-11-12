"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, Check, Copy, Mail, MapPin } from "lucide-react";
import { contact, siteConfig, socialLinks } from "@/data/portfolio";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { SplitWords } from "@/components/ui/SplitWords";
import { SocialIcon } from "@/components/ui/BrandIcons";

export function Contact() {
  const rootRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  // Opens Gmail's compose window in a new tab — works even when no desktop mail app is set up
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(siteConfig.email)}&su=${encodeURIComponent("Project enquiry")}`;

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked: the mailto link still works */
    }
  };


  useIsomorphicLayoutEffect(() => {
    if (!rootRef.current || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from(".ct-word", {
        yPercent: 110,
        rotate: 3,
        duration: 0.9,
        stagger: 0.035,
        scrollTrigger: { trigger: ".ct-heading", start: "top 85%", once: true },
      });
      gsap.from(".ct-fade", {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        scrollTrigger: { trigger: ".ct-grid", start: "top 85%", once: true },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const details = [
    { icon: Mail, label: "Email", value: siteConfig.email, href: `mailto:${siteConfig.email}` },
    { icon: MapPin, label: "Location", value: siteConfig.address },
  ];

  return (
    <section id="contact" ref={rootRef} aria-labelledby="contact-heading" className="relative overflow-hidden bg-ink py-10 sm:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[40rem] w-[60rem] max-w-full -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(198,255,61,0.12),transparent_60%)] blur-2xl"
      />
      <div className="container-x relative">
        <p className="eyebrow text-mute">(06) — Contact</p>
        <h2
          id="contact-heading"
          className="ct-heading mt-6 max-w-6xl font-display text-[clamp(2.1rem,4.4vw,3.9rem)] font-normal leading-[1.08] tracking-[-0.035em] text-white"
        >
          <SplitWords
            text={contact.heading}
            wordClassName="ct-word"
            highlight={["memorable"]}
            highlightClassName="font-serif font-normal italic text-lime"
          />
        </h2>

        <div className="ct-grid mt-10 grid gap-12 lg:mt-12 lg:grid-cols-12 lg:gap-16">
          <aside className="space-y-8 lg:col-span-4">
            <ul className="space-y-3">
              {details.map(({ icon: Icon, label, value, href }) => {
                const inner = (
                  <>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-ink-3 text-lime">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-xs uppercase tracking-[0.14em] text-mute">{label}</span>
                      <span className="block break-all text-paper">{value}</span>
                    </span>
                  </>
                );
                return (
                  <li key={label} className="ct-fade">
                    {href ? (
                      <a
                        href={href}
                        className="flex items-center gap-4 rounded-2xl border border-paper/[0.07] bg-ink-2 p-4 transition-colors duration-300 hover:border-lime/40"
                      >
                        {inner}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 rounded-2xl border border-paper/[0.07] bg-ink-2 p-4">{inner}</div>
                    )}
                  </li>
                );
              })}
            </ul>
            <ul className="ct-fade flex flex-wrap gap-2" aria-label="Social profiles">
              {socialLinks
                .filter((s) => s.label !== "Email")
                .map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full border border-paper/15 px-4 py-2.5 text-sm transition-colors duration-300 hover:border-lime hover:bg-lime hover:text-ink"
                    >
                      <SocialIcon label={s.label} size={16} />
                      <span>@{s.handle}</span>
                      <span className="sr-only">on {s.label} (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
            </ul>
          </aside>


          <div className="ct-fade relative flex flex-col justify-between gap-10 overflow-hidden rounded-[28px] border border-lime/20 bg-gradient-to-br from-lime/[0.10] via-ink-2 to-ink-2 p-6 sm:p-10 lg:col-span-8">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-lime/15 blur-3xl" />
            <div className="relative">
              <p className="eyebrow text-lime">Drop me a line</p>
              <p className="mt-4 max-w-xl text-lg leading-relaxed text-paper/75">
                Tell me about your project, timeline and budget. I usually reply within a day.
              </p>
            </div>
            <a
              href={gmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block break-all font-display text-[clamp(1.6rem,4vw,3.4rem)] leading-tight tracking-[-0.03em] text-white transition-colors duration-300 hover:text-lime"
            >
              {siteConfig.email}
              <span className="mt-2 block h-px w-0 bg-lime transition-all duration-500 group-hover:w-full" aria-hidden="true" />
            </a>
            <div className="relative flex flex-wrap items-center gap-3">
              <a
                href={gmailUrl}
              target="_blank"
              rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-full bg-lime py-2 pl-6 pr-2 font-medium text-ink shadow-[0_0_30px_-8px_rgba(198,255,61,0.7)] transition-transform duration-300 hover:-translate-y-0.5"
              >
                Send me an email
                <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-lime transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={16} aria-hidden="true" />
                </span>
              </a>
              <button
                type="button"
                onClick={copyEmail}
                className="inline-flex items-center gap-2 rounded-full border border-paper/15 px-5 py-3 text-sm text-paper transition-colors duration-300 hover:border-lime hover:text-lime"
              >
                {copied ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
                <span aria-live="polite">{copied ? "Copied!" : "Copy email"}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
