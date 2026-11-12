import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project, ProjectLink } from "@/types";
import { GithubIcon } from "@/components/ui/BrandIcons";

function ExternalAction({
  link,
  label,
  icon,
  variant,
}: {
  link: ProjectLink;
  label: string;
  icon: React.ReactNode;
  variant: "solid" | "outline";
}) {
  const cls =
    variant === "solid"
      ? "bg-paper text-ink hover:bg-lime"
      : "border border-paper/20 text-paper hover:border-lime hover:text-lime";
  if (link.isPlaceholder) {
    return (
      <span
        className={`relative z-10 inline-flex cursor-not-allowed items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium opacity-60 ${cls}`}
        title="Link coming soon"
      >
        {icon}
        {label}
        <span className="sr-only">(link coming soon)</span>
      </span>
    );
  }
  return (
    <a
      href={link.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`relative z-10 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-300 ${cls}`}
    >
      {icon}
      {label}
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export function ProjectCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <article
      className="project-card group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-paper/[0.08] bg-ink-2 transition-[border-color,box-shadow,transform] duration-500 hover:border-paper/20 hover:shadow-[0_30px_80px_-30px_color-mix(in_srgb,var(--accent)_40%,transparent)] focus-within:border-lime/60"
      style={{ ["--accent" as string]: project.accent }}
      data-cursor-label="View"
    >
      {/* soft accent glow on hover */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px rounded-[28px] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        style={{ background: `radial-gradient(600px circle at 50% 0%, ${project.accent}22, transparent 60%)` }}
      />

      <div className="project-media relative m-2 aspect-[16/10] overflow-hidden rounded-[22px] bg-ink-3 lg:aspect-auto lg:min-h-0 lg:flex-1">
        <div className="project-img-wrap absolute inset-[-6%]">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 60vw, 100vw"
            className="object-cover brightness-90 transition-[transform,filter] duration-[1.1s] group-hover:brightness-105 ease-[var(--ease-expo)] group-hover:scale-[1.06]"
            unoptimized={project.image.endsWith(".svg")}
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-30"
        />
        <span className="absolute left-4 top-4 rounded-full bg-ink/75 px-3 py-1.5 text-xs text-paper backdrop-blur">
          {project.category}
        </span>
        <span className="absolute right-4 top-4 font-display text-sm text-paper/80">{project.year}</span>
      </div>

      <div className="relative flex flex-col gap-5 p-5 sm:p-7">
        <div className="flex items-start justify-between gap-6">
          <div>
            <span className="project-meta eyebrow block" style={{ color: project.accent }}>
              ({project.index})
            </span>
            <h3 className="project-meta mt-2 font-display text-xl font-normal leading-tight tracking-tight text-white sm:text-2xl">
              <Link
                href={`/projects/${project.slug}`}
                className="after:absolute after:inset-0 after:z-0 after:rounded-[28px] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-2 focus-visible:after:outline-lime"
              >
                {project.title}
              </Link>
            </h3>
          </div>
          <span
            aria-hidden="true"
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-paper/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-transparent group-hover:bg-[var(--accent)] group-hover:text-ink"
          >
            <ArrowUpRight size={20} />
          </span>
        </div>

        <p className="project-meta line-clamp-3 max-w-2xl text-paper/70">{project.description}</p>

        <ul className="project-meta flex flex-wrap gap-2" aria-label="Technologies">
          {project.technologies.map((t) => (
            <li key={t} className="rounded-full border border-paper/10 px-3 py-1 text-xs text-paper/75">
              {t}
            </li>
          ))}
        </ul>

        <div className="project-meta flex flex-wrap gap-2 pt-1">
          {project.live && <ExternalAction
            link={project.live}
            label="Live Preview"
            variant="solid"
            icon={<ArrowUpRight size={16} aria-hidden="true" />}
          />}
          {project.github && (
            <ExternalAction link={project.github} label="GitHub" variant="outline" icon={<GithubIcon size={16} />} />
          )}
        </div>
      </div>
    </article>
  );
}
