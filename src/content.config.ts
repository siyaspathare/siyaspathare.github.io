import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_KEYS } from './lib/categories';

const works = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/works' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      image: image(),
      category: z.enum(CATEGORY_KEYS),
      year: z.number().optional(),
      medium: z.string().optional(),
      featured: z.boolean().default(false),
      order: z.number().default(999),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/pages' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tagline: z.string().optional(),
      photo: image().optional(),
      email: z.string().optional(),
      instagram: z.string().optional(),
      behance: z.string().optional(),
      linkedin: z.string().optional(),
      cvPdf: z.string().optional(),
    }),
});

export const collections = { works, pages };
