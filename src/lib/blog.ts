import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import type { Post, PostMeta } from '@/types/blog';

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog');

export async function getAllPosts(directory = BLOG_DIR): Promise<PostMeta[]> {
  let files: string[];
  try {
    files = await readdir(directory);
  } catch {
    return [];
  }

  const mdxFiles = files.filter((f) => f.endsWith('.mdx'));

  const posts = await Promise.all(
    mdxFiles.map(async (filename) => {
      const raw = await readFile(path.join(directory, filename), 'utf8');
      const { data } = matter(raw);
      return {
        slug: filename.replace(/\.mdx$/, ''),
        title: data.title ?? '',
        description: data.description ?? '',
        date: data.date ?? '',
        tags: data.tags ?? [],
        image: data.image,
        draft: data.draft ?? false,
      } satisfies PostMeta;
    })
  );

  return posts
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostBySlug(slug: string, directory = BLOG_DIR): Promise<Post | null> {
  try {
    const raw = await readFile(path.join(directory, `${slug}.mdx`), 'utf8');
    const { data, content } = matter(raw);
    if (data.draft) return null;
    return {
      slug,
      title: data.title ?? '',
      description: data.description ?? '',
      date: data.date ?? '',
      tags: data.tags ?? [],
      image: data.image,
      draft: data.draft ?? false,
      content,
    };
  } catch {
    return null;
  }
}

export async function getAllTags(): Promise<Map<string, number>> {
  const posts = await getAllPosts();
  const tags = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags) {
      tags.set(tag, (tags.get(tag) ?? 0) + 1);
    }
  }

  return tags;
}
