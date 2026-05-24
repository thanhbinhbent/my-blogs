import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      slug: z.string().optional(),
      lang: z.enum(['en', 'vi']).default('en'),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      coverImage: z.union([image(), z.string()]).optional(),
      canonicalURL: z.string().url().optional(),
      ogImage: z.union([image(), z.string()]).optional(),
    }),
});

export const collections = { blog };
