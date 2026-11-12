import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/data/portfolio";
import { PageHeader } from "@/components/layout/Navbar";
import { GithubIcon } from "@/components/ui/BrandIcons";
import { ProjectReveal } from "./ProjectReveal";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.shortTitle,
    description: project.description,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.title, description: project.description },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();
  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  const actions = [
    { label: "Live Preview", link: project.live, icon: <ArrowUpRight size={16} aria-hidden="true" />, solid: true },
    { label: "GitHub", link: project.github, icon: <GithubIcon size={16} />, solid: false },
  ].flatMap((a) => (a.link ? [{ ...a, link: a.link }] : []));

  return (
    <>
      <PageHeader />
      <main id="main" className="pb-24 pt-32 sm:pt-40">
        <ProjectReveal>
          <article className="container-x">
            <Link
              href="/#projects"
              className="pr-fade inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-paper"
            >
              <ArrowLeft size={16} aria-hidden="true" /> Back to projects
            </Link>

            <header className="mt-10 grid gap-8 lg:grid-cols-12">
              <div className="lg:col-span-8">
                <p className="pr-fade eyebrow" style={{ color: project.accent }}>
                  ({project.index}) — {project.category}
                </p>
                <h1 className="pr-fade mt-5 font-display text-[clamp(2.1rem,4.4vw,3.9rem)] font-normal leading-[1.08] tracking-[-0.035em] text-white">
                  {project.title}
                </h1>
              </div>
              <dl className="pr-fade grid grid-cols-2 gap-6 self-end text-sm lg:col-span-4">
                <div>
                  <dt className="eyebrow text-mute">Year</dt>
                  <dd className="mt-1 text-paper">{project.year}</dd>
                </div>
                <div>
                  <dt className="eyebrow text-mute">Role</dt>
                  <dd className="mt-1 text-paper">{project.role}</dd>
                </div>
              </dl>
            </header>

            <div className="pr-media relative mt-12 aspect-[16/9] overflow-hidden rounded-[28px] border border-paper/10 bg-ink-2">
              <Image
                src={project.image}
                alt={project.imageAlt}
                fill
                priority
                sizes="100vw"
                className="pr-img object-cover"
                unoptimized={project.image.endsWith(".svg")}
              />
            </div>

            <div className="mt-16 grid gap-12 lg:grid-cols-12">
              <div className="space-y-8 lg:col-span-7">
                <p className="pr-fade font-display text-xl font-light leading-snug tracking-tight text-paper/90 sm:text-2xl">
                  {project.description}
                </p>
                <div className="pr-fade flex flex-wrap gap-3">
                  {actions.map((a) =>
                    a.link.isPlaceholder ? (
                      <span
                        key={a.label}
                        title="Link coming soon"
                        className={`inline-flex cursor-not-allowed items-center gap-2 rounded-full px-5 py-3 text-sm font-medium opacity-60 ${
                          a.solid ? "bg-paper text-ink" : "border border-paper/20"
                        }`}
                      >
                        {a.icon} {a.label} <span className="sr-only">(link coming soon)</span>
                      </span>
                    ) : (
                      <a
                        key={a.label}
                        href={a.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition-colors ${
                          a.solid ? "bg-paper text-ink hover:bg-lime" : "border border-paper/20 hover:border-lime hover:text-lime"
                        }`}
                      >
                        {a.icon} {a.label} <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    ),
                  )}
                </div>
              </div>

              <aside className="space-y-10 lg:col-span-5">
                <section aria-labelledby="highlights-heading" className="pr-fade">
                  <h2 id="highlights-heading" className="eyebrow text-mute">
                    Highlights
                  </h2>
                  <ul className="mt-4 divide-y divide-paper/10 border-y border-paper/10">
                    {project.details.map((d) => (
                      <li key={d} className="flex gap-3 py-4 text-paper/85">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: project.accent }} aria-hidden="true" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </section>
                <section aria-labelledby="stack-heading" className="pr-fade">
                  <h2 id="stack-heading" className="eyebrow text-mute">
                    Technologies
                  </h2>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {project.technologies.map((t) => (
                      <li key={t} className="rounded-full border border-paper/15 px-4 py-2 text-sm">
                        {t}
                      </li>
                    ))}
                  </ul>
                </section>
              </aside>
            </div>

            <Link
              href={`/projects/${next.slug}`}
              className="group mt-24 flex items-end justify-between gap-6 border-t border-paper/10 pt-10"
              data-cursor-label="Next"
            >
              <span>
                <span className="eyebrow text-mute">Next project</span>
                <span className="mt-3 block font-display text-[clamp(1.75rem,3.6vw,3rem)] font-normal leading-none tracking-[-0.035em] transition-colors group-hover:text-lime">
                  {next.shortTitle}
                </span>
              </span>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-paper/20 transition-all duration-500 group-hover:-rotate-45 group-hover:bg-lime group-hover:text-ink">
                <ArrowRight size={22} aria-hidden="true" />
              </span>
            </Link>
          </article>
        </ProjectReveal>
      </main>
    </>
  );
}
