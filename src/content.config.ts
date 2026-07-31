// Content collections (Astro 5 content layer).
// Every markdown file in src/content/blog/ becomes a post at /blog/<filename>/.
// Adding a post = dropping one .md file there with this front matter — the
// blog index, RSS feed, and sitemap pick it up automatically.
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('Sergio Prada'),
    tags: z.array(z.string()).default([]),
    // Posts with draft: true build locally but are excluded from the
    // published index, RSS, and sitemap until the flag is removed.
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
