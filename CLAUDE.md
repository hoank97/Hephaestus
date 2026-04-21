# Study Website (Astro Blog) - AI Assistant Guidelines

## 1. Project Context
This is a personal blog and study website built using the **Astro** framework. The goal is to post technical blogs and study notes, with a UI inspired by `sagarshiroya.dev`.

## 2. Tech Stack
- **Core Framework:** Astro (`astro`)
- **Styling:** Tailwind CSS (`tailwindcss`)
- **Language:** TypeScript (`.ts`, `.tsx`, `.astro`)
- **Content:** Markdown (`.md`) and MDX (`.mdx`) using Astro Content Collections.
- **Icons:** Astro Icon or direct SVG.

## 3. Recommended Development Workflow
- **Package Manager:** `npm` (or `pnpm`/`yarn` depending on preference, fallback to `npm`).
- **Start Dev Server:** `npm run dev`
- **Build Server:** `npm run build`

## 4. Code Architecture & Conventions
- **Routing:** Use Astro's file-based routing inside `src/pages/`.
- **Content:** All blog posts MUST be placed in `src/content/blog/`. Validate frontmatter schemas in `src/content/config.ts`.
- **Components:** Reusable UI components (like Header, Footer, PostCard) go into `src/components/`.
- **Layouts:** Shareable wrapping structures go in `src/layouts/`.
- **Assets:** Non-optimized public assets go in `public/`. Optimized images processed by Astro go in `src/assets/`.
- **Styling:** Rely strictly on **Tailwind CSS** utility classes. Avoid custom CSS unless absolutely necessary (for complex animations or global base resets).

## 5. Architectural Rules
- **Island Architecture:** Keep it static zero-JS by default. Only hydrate components when necessary (using `client:load`, `client:visible`, etc.).
- **Type Safety:** Always heavily type frontmatter data from MD/MDX files using `zod`.
- **SEO First:** Make sure to reuse the `<SEO />` or standard meta tags in layouts to handle proper open graph and title tags dynamically.
- **Minimalism:** Follow a minimalist UI/UX philosophy. Readability is king.

## 6. Target Aesthetic
- Clean, readable typography.
- Excellent responsive layouts.
- Unobtrusive light/dark mode.
- Structured code blocks with proper syntax highlighting.
