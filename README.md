# Fizza Bibi — Portfolio

Personal portfolio for **Fizza Bibi**, Full Stack Developer in Islamabad, Pakistan.
Built with Next.js (App Router), TypeScript, Tailwind CSS v4, GSAP + ScrollTrigger, Lenis, Lucide and React Hook Form.

Creative direction: dark editorial layout, near-black + warm off-white + electric lime, oversized Bricolage Grotesque headlines with Instrument Serif italic accents, a static grain texture, a custom cursor, magnetic buttons and scroll-driven reveals.

---

## 1. Folder structure

```
fizza-portfolio/
├── app/
│   ├── api/contact/route.ts      # Contact form endpoint (server only)
│   ├── projects/[slug]/
│   │   ├── page.tsx              # Static project detail pages
│   │   └── ProjectReveal.tsx     # Detail page animations
│   ├── globals.css               # Tailwind v4 theme, grain, marquee, utilities
│   ├── icon.svg                  # Favicon (placeholder)
│   ├── layout.tsx                # Fonts, SEO metadata, JSON-LD, providers
│   ├── not-found.tsx             # Custom 404
│   ├── opengraph-image.tsx       # Generated OG image
│   ├── twitter-image.tsx         # Generated Twitter card
│   ├── page.tsx                  # Home page (all sections)
│   ├── robots.ts                 # /robots.txt
│   └── sitemap.ts                # /sitemap.xml
├── components/
│   ├── layout/   Navbar, MobileMenu, Preloader, Footer
│   ├── providers/AppProvider.tsx # Lenis + ScrollTrigger sync, scroll helpers, ready state
│   ├── sections/ Hero, About, Experience, Projects, ProjectCard, Skills, Education, Contact
│   └── ui/       Button, Magnetic, CustomCursor, SplitWords, SectionHeading, BrandIcons
├── data/portfolio.ts             # ALL site content lives here
├── hooks/useIsomorphicLayoutEffect.ts
├── lib/
│   ├── gsap.ts                   # GSAP registration + motion/device helpers
│   ├── validation.ts             # Shared form validation rules
│   └── contact.ts                # Server-only email delivery (Formspree / Resend)
├── public/
│   ├── projects/*.svg            # Placeholder project images
│   ├── portrait.svg              # Placeholder portrait
│   ├── fizza-bibi-resume.pdf     # Placeholder résumé
│   ├── icon.svg, manifest.webmanifest
├── types/index.ts
├── .env.example
└── eslint.config.mjs, next.config.ts, postcss.config.mjs, tsconfig.json
```

## 2. Install & run

Requires Node.js 18.18+ (Node 20 or newer recommended).

```bash
npm install
```

```bash
npm run dev        # http://localhost:3000
```

```bash
npm run lint       # ESLint
npm run typecheck  # TypeScript
npm run build      # production build
npm run start      # serve the production build
```

## 3. Environment variables

Copy `.env.example` to `.env.local` and fill in values:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Your live URL (e.g. `https://fizzabibi.vercel.app`). Used for canonical URLs, sitemap and OG tags. |
| `CONTACT_PROVIDER` | `none` (log to server console), `formspree` or `resend` |
| `FORMSPREE_FORM_ID` | Formspree form ID |
| `RESEND_API_KEY` | Resend API key (secret) |
| `CONTACT_FROM_EMAIL` | Sender address on a Resend-verified domain |
| `CONTACT_TO_EMAIL` | Inbox that receives messages |

Secrets are only read in `lib/contact.ts`, which is marked `server-only` and runs inside `app/api/contact/route.ts`. Nothing secret is prefixed with `NEXT_PUBLIC_`, so nothing reaches the browser.

### Connect Formspree
1. Create a form at formspree.io and copy its ID (the part after `/f/`).
2. Set `CONTACT_PROVIDER=formspree` and `FORMSPREE_FORM_ID=yourid`.

### Connect Resend
1. Create an API key at resend.com. Verify your domain (or use `onboarding@resend.dev` for testing — it can only send to your own account email).
2. Set `CONTACT_PROVIDER=resend`, `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`.

### Another service
Add a new branch in `deliverContact()` inside `lib/contact.ts` (e.g. `if (provider === "emailjs") { ... }`). The form and API route don't need to change.

## 4. Replacing content & assets

- **Text, experience, skills, education, links** → edit `data/portfolio.ts`.
- **Portrait** → add `public/portrait.jpg` (4:5 ratio, ~1200×1500) and set `about.portrait = "/portrait.jpg"`.
- **Project images** → add images to `public/projects/` (16:10, ~1920×1200 JPG/WebP) and update each project's `image` and `imageAlt`. Non-SVG images are automatically optimized by `next/image`.
- **Project links** → in each project set `live: { href: "https://…", isPlaceholder: false }` and the same for `github`. Placeholder links render as disabled “coming soon” buttons.
- **Résumé** → replace `public/fizza-bibi-resume.pdf` with your real PDF (keep the same filename).
- **Social URLs** → update `socialLinks` (GitHub `fizzabutt0599`, LinkedIn `fiza8`).
- **Favicon** → replace `app/icon.svg` (and `public/icon.svg`). OG images are generated in `app/opengraph-image.tsx`.

## 5. Deploy to Vercel

1. Push the project to a GitHub repository.
2. On vercel.com → **Add New… → Project** → import the repo. Framework preset: **Next.js** (auto-detected). Build command `npm run build`, output handled automatically.
3. In **Settings → Environment Variables** add `NEXT_PUBLIC_SITE_URL` and your contact provider variables.
4. Deploy. After adding a custom domain, update `NEXT_PUBLIC_SITE_URL` and redeploy.

CLI alternative:

```bash
npm i -g vercel
```

```bash
vercel --prod
```

## 6. Animation & performance notes

- Every GSAP animation is created inside `gsap.context()` / `gsap.matchMedia()` and reverted on unmount.
- `prefers-reduced-motion` disables Lenis, the preloader sequence, the custom cursor, magnetic effects, parallax and the horizontal pin; content is shown immediately.
- Touch / low-power devices skip the cursor, magnetic and mouse-parallax effects; the projects section becomes a stacked vertical list below 1024px.
- Only `transform`, `opacity` and `clip-path` are animated. The grain is a static SVG.
- The horizontal projects scroller scrolls focused cards into view for keyboard users.
- The preloader runs once per browser session.

## 7. Final testing checklist

- [ ] `npm run lint`, `npm run typecheck` and `npm run build` pass
- [ ] Preloader counts 0→100 and reveals the hero; second visit in the same tab skips it
- [ ] Nav links smooth-scroll and the active pill follows the section in view
- [ ] Mobile menu opens/closes, Escape closes it, focus stays inside, page doesn't scroll behind it
- [ ] Hero words animate in; mouse parallax works on desktop
- [ ] Projects scroll horizontally on ≥1024px; stacked on tablet/mobile; detail pages open
- [ ] Tab through the whole page: focus ring visible everywhere, skip link works
- [ ] Contact form: empty submit shows errors; valid submit shows loading then success; provider failure shows error
- [ ] OS “reduce motion” on → no smooth scroll, no pinning, everything readable
- [ ] No horizontal scrollbar at 320px, 375px, 768px, 1024px, 1440px
- [ ] `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, `/fizza-bibi-resume.pdf` and a random 404 URL all work
- [ ] Lighthouse: Performance, Accessibility, Best Practices, SEO all green
