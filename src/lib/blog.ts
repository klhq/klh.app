import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Post, PostMeta } from '@/types/blog';
import { parsePost } from './blog-frontmatter';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

export interface BlogReadingOptions {
  includeDrafts?: boolean;
}

function isMissing(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}

export async function getAllPosts(
  directory = BLOG_DIR,
  options: BlogReadingOptions = {}
): Promise<PostMeta[]> {
  let files: string[];
  try {
    files = await readdir(directory);
  } catch (error) {
    if (isMissing(error)) return [];
    throw error;
  }
  const posts = await Promise.all(
    files
      .filter((f) => f.endsWith('.mdx'))
      .map(async (filename) => {
        const raw = await readFile(path.join(directory, filename), 'utf8');
        const post = parsePost(raw, filename.slice(0, -4));
        return {
          slug: post.slug,
          title: post.title,
          description: post.description,
          date: post.date,
          updated: post.updated,
          readingMinutes: post.readingMinutes,
          tags: post.tags,
          image: post.image,
          draft: post.draft,
        };
      })
  );
  return posts
    .filter((post) => options.includeDrafts || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPostBySlug(
  slug: string,
  directory = BLOG_DIR,
  options: BlogReadingOptions = {}
): Promise<Post | null> {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(slug)) return null;
  let raw: string;
  try {
    raw = await readFile(path.join(directory, `${slug}.mdx`), 'utf8');
  } catch (error) {
    if (isMissing(error)) return null;
    throw error;
  }
  const post = parsePost(raw, slug);
  return post.draft && !options.includeDrafts ? null : post;
}

export async function getAllTags(
  options: BlogReadingOptions = {}
): Promise<Map<string, number>> {
  const posts = await getAllPosts(undefined, options);
  const tags = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.tags) tags.set(tag, (tags.get(tag) ?? 0) + 1);
  }
  return tags;
}
