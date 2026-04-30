# Study Website (Astro Blog) - AI Assistant Guidelines

> Documentation hub: [./.clade/INDEX.md](./.clade/INDEX.md)
> 
> Chi tiết rules/business/architecture đã được tách vào `.clade/` để dễ maintain và tham chiếu.

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
- **Content:** All blog posts MUST be placed in `src/data/blog/`. Validate frontmatter schemas in `src/content/config.ts`.
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

## 7. Content Generation Rules (Blog Posts)
### 7.1 Source of truth
- Always follow schema in `src/content.config.ts`.
- Content path: `src/data/blog/*.md`

### 7.2 Blog frontmatter rules
- Required:
  - `title` (string)
  - `description` (string)
  - `pubDatetime` (ISO 8601, UTC)
  - `tags` (string[])
- Optional:
  - `modDatetime` (ISO 8601, UTC)
  - `featured` (boolean)
  - `draft` (boolean)

### 7.3 Formatting conventions
- Use `ISO 8601` UTC datetime, example: `2026-04-22T00:00:00Z`.
- Use lowercase kebab-case tags whenever possible.
- Keep `description` concise (1–2 sentences).

### 7.4 Copy-paste template
```md
---
title: "Your blog title"
pubDatetime: 2026-04-22T00:00:00Z
description: "One or two concise sentences describing the post."
tags:
  - "system-design"
  - "architecture"
featured: false
draft: false
---

Your blog content here.
```

### 7.5 Validation checklist before merge
- Run `npm run build`.
- Verify:
  - `/posts` shows new blog post
  - `/tags` includes tags from the new post
  - `/tags/<tag>` resolves without 404 and shows related content
- If schema errors appear, re-check `src/content.config.ts` first.
