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

const courses = defineCollection({
  loader: glob({ base: './src/content/courses', pattern: '*/index.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      level: z.enum(['beginner', 'intermediate', 'advanced']),
      tags: z.array(z.string()).default([]),
      coverImage: z.union([image(), z.string()]).optional(),
      language: z.enum(['en', 'vi']).default('en'),
      published: z.boolean().default(false),
      order: z.number().default(0),
      estimatedHours: z.number().optional(),
      totalLessons: z.number().optional(),
      prerequisites: z.array(z.string()).default([]),
      color: z.string().optional(),
    }),
});

const quizQuestion = z.object({
  question: z.string(),
  options: z.array(z.string()),
  correct: z.number(),
  explanation: z.string().optional(),
});

const lessons = defineCollection({
  loader: glob({ base: './src/content/courses', pattern: '*/*/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    type: z.enum(['reading', 'video', 'quiz', 'exam']).default('reading'),
    duration: z.number().optional(),
    order: z.number().default(0),
    chapterTitle: z.string(),
    chapterOrder: z.number().default(0),
    draft: z.boolean().default(false),
    videoUrl: z.string().optional(),
    quizData: z.array(quizQuestion).optional(),
  }),
});

export const collections = { blog, courses, lessons };
