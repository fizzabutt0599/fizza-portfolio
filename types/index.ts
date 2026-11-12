export interface NavItem {
  id: string;
  label: string;
}

export interface SocialLink {
  label: "GitHub" | "LinkedIn" | "Email";
  href: string;
  handle: string;
}

export interface Stat {
  value: string;
  label: string;
  /** Optional numeric value for count-up animation */
  count?: number;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  responsibilities: string[];
}

export interface ProjectLink {
  href: string;
  /** true when the URL is a stand-in that should be replaced with a real link */
  isPlaceholder: boolean;
}

export interface Project {
  slug: string;
  index: string;
  title: string;
  shortTitle: string;
  category: string;
  year: string;
  role: string;
  description: string;
  details: string[];
  technologies: string[];
  image: string;
  imageAlt: string;
  accent: string;
  live?: ProjectLink;
  github?: ProjectLink;
}

export interface SkillGroup {
  title: string;
  blurb: string;
  skills: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
}

export interface Certification {
  title: string;
  issuer: string;
  period: string;
}

export interface ContactFormValues {
  name: string;
  email: string;
  projectType: string;
  message: string;
  /** honeypot field, must stay empty */
  company?: string;
}
