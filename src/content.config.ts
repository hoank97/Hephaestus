import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { SITE } from "@/config";

export const BLOG_PATH = "src/data/blog";
export const QUESTIONS_PATH = "src/data/questions";

const blog = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${BLOG_PATH}` }),
  schema: ({ image }) =>
    z.object({
      author: z.string().default(SITE.author),
      pubDatetime: z.date(),
      modDatetime: z.date().optional().nullable(),
      title: z.string(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      tags: z.array(z.string()).default(["others"]),
      ogImage: image().or(z.string()).optional(),
      description: z.string(),
      canonicalURL: z.string().optional(),
      hideEditPost: z.boolean().optional(),
      timezone: z.string().optional(),
    }),
});

const questions = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: `./${QUESTIONS_PATH}` }),
  schema: z.object({
    question: z.string(),
    answer: z.string(),
    tags: z.array(z.string()).default([]),
    pubDatetime: z.date(),
    featured: z.boolean().optional(),
  }),
});

export const collections = { blog, questions };
