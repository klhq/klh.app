import matter from 'gray-matter';
import { load, JSON_SCHEMA } from 'js-yaml';
import type { Post } from '@/types/blog';

export function parsePost(raw: string, slug: string): Post {
  let parsed: ReturnType<typeof matter>;
  try {
    parsed = matter(raw, {
      engines: {
        yaml: (source: string) =>
          load(source, { schema: JSON_SCHEMA }) as Record<string, unknown>,
      },
    });
  } catch (error) {
    throw new Error(`[blog] ${slug}: invalid frontmatter`, { cause: error });
  }
  const { data, content } = parsed;
  const fail = (field: string): never => {
    throw new Error(`[blog] ${slug}: invalid ${field}`);
  };
  const text = (field: string): string => {
    const value: unknown = data[field];
    if (typeof value !== 'string' || !value.trim()) return fail(field);
    return value.trim();
  };
  const date =
    data.date instanceof Date
      ? data.date.toISOString().slice(0, 10)
      : text('date');
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !Number.isFinite(Date.parse(date)) ||
    new Date(date).toISOString().slice(0, 10) !== date
  )
    fail('date');
  if (
    data.tags !== undefined &&
    (!Array.isArray(data.tags) ||
      data.tags.some((tag: unknown) => typeof tag !== 'string' || !tag.trim()))
  )
    fail('tags');
  if (data.draft !== undefined && typeof data.draft !== 'boolean')
    fail('draft');
  if (
    data.image !== undefined &&
    (typeof data.image !== 'string' || !data.image.trim())
  )
    fail('image');
  return {
    slug,
    title: text('title'),
    description: text('description'),
    date,
    tags: [
      ...new Set<string>((data.tags ?? []).map((tag: string) => tag.trim())),
    ],
    image: data.image,
    draft: data.draft ?? false,
    content,
  };
}
