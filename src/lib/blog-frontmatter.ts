import matter from 'gray-matter';
import { load, JSON_SCHEMA } from 'js-yaml';
import type { Post } from '@/types/blog';
import { estimateReadingMinutes } from './blog-reading';

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
  const updated = data.updated === undefined ? undefined : text('updated');
  if (
    updated !== undefined &&
    (!/^\d{4}-\d{2}-\d{2}$/.test(updated) ||
      !Number.isFinite(Date.parse(updated)) ||
      new Date(updated).toISOString().slice(0, 10) !== updated ||
      updated < date)
  )
    fail('updated');
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
  let links: Post['links'];
  if (data.links !== undefined) {
    if (
      !data.links ||
      typeof data.links !== 'object' ||
      Array.isArray(data.links) ||
      Object.keys(data.links).some((key) => !['github', 'demo'].includes(key))
    )
      fail('links');
    links = {};
    for (const key of ['github', 'demo'] as const) {
      if (data.links[key] === undefined) continue;
      if (typeof data.links[key] !== 'string') fail(`links.${key}`);
      try {
        const url = new URL(data.links[key].trim());
        if (
          !['https:', 'http:'].includes(url.protocol) ||
          url.username ||
          url.password
        )
          fail(`links.${key}`);
        links[key] = url.href;
      } catch {
        fail(`links.${key}`);
      }
    }
  }
  return {
    slug,
    title: text('title'),
    description: text('description'),
    date,
    updated,
    readingMinutes: estimateReadingMinutes(content),
    links,
    tags: [
      ...new Set<string>((data.tags ?? []).map((tag: string) => tag.trim())),
    ],
    image: data.image,
    draft: data.draft ?? false,
    content,
  };
}
