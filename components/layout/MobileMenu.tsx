"use client";

import { useEffect, useRef } from "react";
import { ArrowDownToLine } from "lucide-react";
import { navItems, siteConfig, socialLinks } from "@/data/portfolio";
import { useApp } from "@/components/providers/AppProvider";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  active: string;
  onNavigate: (id: string) => (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export function MobileMenu({ open, onClose, active, onNavigate }: MobileMenuProps) {
  const { lockScroll } = useApp();
  const rootRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // Build the open/close timeline once
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.set(root, { autoAlpha: 0, clipPath: "circle(0% at calc(100% - 3rem) 2.6rem)" });
      const reduce = prefersReducedMotion();
      tlRef.current = gsap
        .timeline({ paused: true })
        .to(root, {
          autoAlpha: 1,
          clipPath: "circle(150% at calc(100% - 3rem) 2.6rem)",
          duration: reduce ? 0.01 : 0.9,
          ease: "expo.inOut",
        })
        .from(
          ".mm-link",
          { yPercent: 110, duration: reduce ? 0.01 : 0.8, stagger: reduce ? 0 : 0.06, ease: "expo.out" },
          reduce ? 0 : 0.35,
        )
        .from(".mm-meta", { opacity: 0, y: 16, duration: reduce ? 0.01 : 0.6, stagger: 0.05 }, reduce ? 0 : 0.55);
    }, root);
    return () => {
      ctx.revert();
      tlRef.current = null;
    };
  }, []);

  const wasOpen = useRef(false);
  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (!open && !wasOpen.current) return; // nothing to close on first render
    wasOpen.current = open;
    if (open) {
      tl.timeScale(1).play();
      lockScroll(true);
      const first = rootRef.current?.querySelector<HTMLElement>("a");
      setTimeout(() => first?.focus(), 400);
    } else {
      tl.timeScale(1.6).reverse();
      lockScroll(false);
    }
  }, [open, lockScroll]);

  // Escape to close + simple focus trap
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && rootRef.current) {
        const focusables = rootRef.current.querySelectorAll<HTMLElement>("a, button");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={rootRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site menu"
      aria-hidden={!open}
      className="invisible fixed inset-0 z-[45] flex flex-col justify-between overflow-y-auto bg-ink-2 px-6 pb-8 pt-28 text-paper lg:hidden"
    >
      <nav aria-label="Mobile">
        <ul className="space-y-1">
          {navItems.map((item, i) => (
            <li key={item.id} className="overflow-hidden">
              <a
                href={`#${item.id}`}
                onClick={onNavigate(item.id)}
                tabIndex={open ? 0 : -1}
                aria-current={active === item.id ? "location" : undefined}
                className="mm-link flex items-baseline gap-4 py-1 transition-colors hover:text-lime font-display text-[clamp(2.1rem,9vw,3.25rem)] font-normal leading-none tracking-[-0.035em]"
              >
                <span className="text-xs font-normal tracking-normal text-mute">0{i + 1}</span>
                <span className={active === item.id ? "font-serif font-normal italic text-lime" : ""}>
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-10 space-y-6">
        <a
          href={siteConfig.resume}
          download
          tabIndex={open ? 0 : -1}
          className="mm-meta inline-flex items-center gap-2 rounded-full bg-lime px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-paper"
        >
          <ArrowDownToLine size={16} aria-hidden="true" /> Download Resume
        </a>
        <div className="mm-meta flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              tabIndex={open ? 0 : -1}
              target={s.label === "Email" ? undefined : "_blank"}
              rel={s.label === "Email" ? undefined : "noopener noreferrer"}
              className="text-paper/80 underline decoration-paper/25 underline-offset-4 transition-colors hover:text-lime hover:decoration-lime"
            >
              {s.label}
            </a>
          ))}
        </div>
        <p className="mm-meta text-sm text-mute">{siteConfig.location}</p>
      </div>
    </div>
  );
}
