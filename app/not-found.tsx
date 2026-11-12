import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <PageHeader />
      <main id="main" className="relative flex min-h-[100svh] items-center overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(198,255,61,0.16),transparent_65%)] blur-2xl"
        />
        <div className="container-x relative text-center">
          <p className="eyebrow text-mute">Error 404</p>
          <h1 className="mt-6 font-display text-[clamp(6rem,24vw,20rem)] font-bold leading-[0.8] tracking-[-0.06em]">
            4<span className="font-serif font-normal italic text-lime">0</span>4
          </h1>
          <p className="mx-auto mt-8 max-w-md text-lg text-paper/70">
            This page wandered off. Let’s get you back to something that works as good as it feels.
          </p>
          <Link
            href="/"
            className="mt-10 inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-paper"
          >
            <ArrowLeft size={16} aria-hidden="true" /> Back home
          </Link>
        </div>
      </main>
    </>
  );
}
