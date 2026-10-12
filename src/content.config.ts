import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const resources = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/resources' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['Project scope', 'Roadmap', 'Evaluation']),
    order: z.number().int(),
    audience: z.enum(['Institution', 'Developer', 'Both']).default('Both'),
    publicationDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { resources };
