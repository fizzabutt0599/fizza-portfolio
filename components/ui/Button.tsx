"use client";

import Link from "next/link";
import { forwardRef } from "react";
import { Magnetic } from "./Magnetic";

type Variant = "primary" | "outline" | "ghost" | "dark";

interface BaseProps {
  children: React.ReactNode;
  variant?: Variant;
  icon?: React.ReactNode;
  className?: string;
  magnetic?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "bg-lime text-ink hover:bg-paper",
  outline: "border border-paper/25 text-paper hover:border-lime hover:text-lime",
  ghost: "text-paper hover:text-lime",
  dark: "bg-ink text-paper hover:bg-ink-3",
};

const base =
  "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full px-6 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-60";

function Inner({ children, icon }: { children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <>
      <span className="relative block overflow-hidden">
        <span className="block transition-transform duration-500 ease-[var(--ease-expo)] group-hover:-translate-y-full">
          {children}
        </span>
        <span
          aria-hidden="true"
          className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-y-0"
        >
          {children}
        </span>
      </span>
      {icon && (
        <span className="transition-transform duration-500 ease-[var(--ease-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          {icon}
        </span>
      )}
    </>
  );
}

type LinkButtonProps = BaseProps & {
  href: string;
  external?: boolean;
  download?: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  "aria-label"?: string;
};

export function LinkButton({
  children,
  href,
  variant = "primary",
  icon,
  className,
  magnetic = true,
  external,
  download,
  onClick,
  ...rest
}: LinkButtonProps) {
  const classes = `${base} ${variants[variant]} ${className ?? ""}`;
  const isInternal = href.startsWith("/") && !download;
  const el = isInternal ? (
    <Link href={href} className={classes} onClick={onClick} aria-label={rest["aria-label"]}>
      <Inner icon={icon}>{children}</Inner>
    </Link>
  ) : (
    <a
      href={href}
      className={classes}
      onClick={onClick}
      aria-label={rest["aria-label"]}
      download={download || undefined}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      <Inner icon={icon}>{children}</Inner>
    </a>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
}

type ButtonProps = BaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { children, variant = "primary", icon, className, magnetic = true, ...rest },
  ref,
) {
  const el = (
    <button ref={ref} className={`${base} ${variants[variant]} ${className ?? ""}`} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </button>
  );
  return magnetic ? <Magnetic>{el}</Magnetic> : el;
});
