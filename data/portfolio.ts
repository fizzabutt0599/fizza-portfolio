/**
 * All portfolio content lives here. Edit this file to update the site.
 * Links marked `isPlaceholder: true` still point to "#" and should be
 * replaced with real URLs before going live.
 */
import type {
  Certification,
  Education,
  Experience,
  NavItem,
  Project,
  SkillGroup,
  SocialLink,
  Stat,
} from "@/types";

export const siteConfig = {
  name: "Fizza Bibi",
  initials: "FB",
  role: "Full Stack Developer",
  location: "Islamabad, Pakistan",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description:
    "Fizza Bibi is a Full Stack Developer in Islamabad, Pakistan, building responsive, scalable and engaging web applications with React, Next.js, TypeScript, WordPress, PHP and Laravel.",
  resume: "/fizza-bibi-resume.pdf",
  email: "bfiza278@gmail.com",
  address: "G-12, Islamabad",
} as const;

export const navItems: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

export const socialLinks: SocialLink[] = [
  { label: "GitHub", href: "https://github.com/fizzabutt0599", handle: "fizzabutt0599" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/fiza8", handle: "fiza8" },
  { label: "Email", href: "mailto:bfiza278@gmail.com", handle: "bfiza278@gmail.com" },
];

export const hero = {
  badge: "Available for exciting opportunities",
  heading: "I build digital experiences that feel as good as they work.",
  intro:
    "I design and develop responsive, scalable, and engaging web applications using modern frontend and backend technologies.",
};

export const about = {
  text: "I’m a results-driven Full Stack Developer experienced in designing, developing, customizing, and maintaining responsive and scalable web applications. I specialize in React.js, Next.js, TypeScript, WordPress, PHP, Laravel, MySQL, WooCommerce, REST APIs, and modern UI development. I enjoy turning complex requirements into user-friendly and high-performing digital experiences.",
  portrait: "/fizza-portrait.jpg",
  portraitAlt: "Fizza Bibi, Full Stack Developer",
};

export const stats: Stat[] = [
  { value: "3", count: 3, label: "Featured Projects" },
  { value: "Full Stack", label: "Expertise" },
  { value: "Front + Back", label: "End to end delivery" },
  { value: "ISB", label: "Based in Islamabad" },
];

export const experiences: Experience[] = [
  {
    company: "Wolfiz Solutions PVT LTD",
    role: "Full Stack Developer",
    period: "April 2026 – Present",
    location: "Islamabad, Pakistan",
    responsibilities: [
      "Develop and maintain responsive and scalable web applications",
      "Build custom WordPress themes and plugins",
      "Develop applications using React.js, Next.js, JavaScript, TypeScript, HTML5, CSS3, and Tailwind CSS",
      "Create custom WordPress functionality using PHP, AJAX, REST APIs, Custom Post Types, Custom Taxonomies, and ACF",
      "Customize WooCommerce features, pricing, carts, checkout flows, and payment integrations",
      "Integrate third-party APIs",
      "Develop backend functionality using PHP, Laravel, and MySQL",
      "Build responsive and interactive interfaces",
      "Handle deployment through Git, GitHub, Vercel, Docker, and Linux servers",
      "Perform debugging, testing, optimization, and maintenance",
    ],
  },
];

export const projects: Project[] = [
  {
    slug: "p3a-pakistan",
    index: "01",
    title: "P3A – Public-Private Partnership Authority Pakistan Website",
    shortTitle: "P3A Pakistan",
    category: "Government · Data Visualization",
    year: "2026",
    role: "Full Stack WordPress Development",
    description:
      "A custom WordPress solution featuring an interactive map of Pakistan for visualizing public-private partnership projects. It includes federal and province-level map views, dynamic SVG markers, animated project locations, informational popups, interactive cards, legends, and pipeline status visualizations.",
    details: [
      "Federal and province-level interactive SVG map views",
      "Dynamic markers and animated project locations driven by ACF data",
      "Informational popups, interactive cards and legends",
      "Pipeline status visualizations loaded through AJAX",
    ],
    technologies: ["WordPress", "PHP", "JavaScript", "jQuery", "AJAX", "CSS", "SVG", "ACF"],
    image: "/projects/p3a.png",
    imageAlt: "P3A interactive map of Pakistan showing provincial project pipelines with markers and summary cards",
    accent: "#c6ff3d",
    live: { href: "https://www.p3a.gov.pk/", isPlaceholder: false },
    github: { href: "#", isPlaceholder: true },
  },
  {
    slug: "wolfiz-portfolio",
    index: "02",
    title: "Wolfiz Portfolio",
    shortTitle: "Wolfiz Portfolio",
    category: "Company Website",
    year: "2026",
    role: "Frontend Development",
    description:
      "A modern and responsive company portfolio created to showcase services, projects, expertise, and technical capabilities through structured content, interactive components, and smooth animations.",
    details: [
      "Structured content architecture for services and case studies",
      "Reusable interactive components built with React and Next.js",
      "Smooth, performance-minded animations",
      "Fully responsive layouts styled with Tailwind CSS",
    ],
    technologies: ["React.js", "Next.js", "JavaScript", "Tailwind CSS"],
    image: "/projects/wolfiz.jpg",
    imageAlt: "Wolfiz Solutions website homepage with the headline Hi, We're Wolfiz",
    accent: "#a78bfa",
    live: { href: "https://wolfiz.com/", isPlaceholder: false },
    github: { href: "#", isPlaceholder: true },
  },
  {
    slug: "emotion-detection",
    index: "03",
    title: "Real-Time Emotion Detection System",
    shortTitle: "Emotion Detection",
    category: "AI · Computer Vision",
    year: "2025",
    role: "Machine Learning Engineering",
    description:
      "An AI-powered application that detects and classifies facial expressions in real time using webcam or video input. It recognizes emotions such as happiness, sadness, anger, surprise, fear, and neutrality.",
    details: [
      "Real-time face detection from webcam or video input",
      "Deep learning model classifying six core emotions",
      "Image pre-processing pipeline for robust predictions",
      "Live overlay of predicted emotion and confidence",
    ],
    technologies: ["Machine Learning", "Computer Vision", "Deep Learning", "Image Processing"],
    image: "/projects/emotion.webp",
    imageAlt: "Real-time emotion detection results with face bounding boxes and predicted emotion labels",
    accent: "#ff9f6e",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    title: "Frontend",
    blurb: "Interfaces that are fast, accessible and a little bit delightful.",
    skills: ["React.js", "Next.js", "JavaScript", "TypeScript", "HTML5", "CSS3", "Tailwind CSS", "GSAP"],
  },
  {
    title: "Backend",
    blurb: "Reliable APIs and data layers behind the scenes.",
    skills: ["PHP", "Laravel", "MySQL", "REST APIs", "AJAX"],
  },
  {
    title: "WordPress & E-commerce",
    blurb: "Custom themes, plugins and stores built for real businesses.",
    skills: [
      "WordPress",
      "Custom Theme Development",
      "Custom Plugin Development",
      "WooCommerce",
      "Advanced Custom Fields",
      "Custom Post Types",
      "Custom Taxonomies",
    ],
  },
  {
    title: "Tools & Deployment",
    blurb: "Shipping code safely from laptop to production.",
    skills: ["Git", "GitHub", "Docker", "Vercel", "Linux"],
  },
];

export const education: Education[] = [
  {
    institution: "Quaid-i-Azam University Islamabad",
    degree: "BSCS — Bachelor of Science in Computer Science",
    period: "2021 – 2025",
  },
];

export const certifications: Certification[] = [
  {
    title: "Machine Learning, Data Sciences and AI",
    issuer: "High Impact IT Training Course – NAVTTC",
    period: "May 2025 – August 2025",
  },
  {
    title: "Full Stack Development Internship",
    issuer: "PSEB – Pakistan Software Export Board Internship Program",
    period: "October 2025 – April 2026",
  },
];

export const projectTypes = [
  "Website / Landing page",
  "Web application",
  "WordPress / WooCommerce",
  "Full-time opportunity",
  "Something else",
];

export const contact = {
  heading: "Have a project in mind? Let’s build something memorable.",
};
