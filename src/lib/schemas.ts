// zod contracts for the YAML data files in src/data/.
// These are validated at build time (see src/lib/data.ts): if an edit — human
// or AI — breaks the shape, `npm run build` fails loudly instead of shipping
// a broken page. Keep this file in sync with the YAML files.
import { z } from 'astro/zod';

// 'YYYY-MM' for precise dates, or plain 'YYYY' where the month is not
// meaningful (e.g. a multi-year degree). Sortable as strings either way.
const ym = z.string().regex(/^\d{4}(-\d{2})?$/, "expected 'YYYY-MM' or 'YYYY'");

export const cvSchema = z.object({
  basics: z.object({
    name: z.string(),
    headline: z.string(),
    location: z.string(),
    email: z.string().email(),
    summary: z.string(),
    links: z.array(z.object({ label: z.string(), url: z.string().url() })),
  }),
  experience: z.array(
    z.object({
      company: z.string(),
      role: z.string(),
      start: ym,
      end: ym.nullable(), // null = present
      location: z.string().optional(),
      summary: z.string().optional(),
      highlights: z.array(z.string()),
      tech: z.array(z.string()).default([]),
    }),
  ),
  education: z.array(
    z.object({
      institution: z.string(),
      program: z.string(),
      kind: z.enum(['degree', 'certification', 'course']),
      start: ym,
      end: ym.nullable(),
      details: z.string().optional(),
    }),
  ),
  skills: z.array(
    z.object({
      name: z.string(),
      level: z.number().int().min(1).max(5),
      category: z.enum(['engine', 'language', 'systems', 'tools', 'data']),
    }),
  ),
  languages: z.array(z.object({ name: z.string(), level: z.string() })),
});

export const kudosSchema = z.array(
  z.object({
    quote: z.string(),
    attribution: z.string(), // anonymized, e.g. "Senior Manager, Unity Customer Success"
    year: z.number().int().optional(),
    context: z.string().optional(),
  }),
);

export const projectsSchema = z.array(
  z.object({
    title: z.string(),
    description: z.string(),
    image: z.string().optional(),
    video: z.string().url().optional(),
    link: z.string().url().optional(),
    order: z.number().default(0),
  }),
);

export type Cv = z.infer<typeof cvSchema>;
export type Kudos = z.infer<typeof kudosSchema>;
export type Projects = z.infer<typeof projectsSchema>;
