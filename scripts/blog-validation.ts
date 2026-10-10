import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { compile } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import { parsePost } from '../src/lib/blog-frontmatter';
import { BLOG_IMAGE_PATTERN } from '../src/lib/blog-assets';
import { validateSeries } from '../src/lib/blog-series';
import type { PostMeta } from '../src/types/blog';

interface ContentNode {
  type: string;
  url?: string;
  identifier?: string;
  name?: string;
  attributes?: { type: string; name?: string; value?: unknown }[];
  children?: ContentNode[];
}

function walk(node: ContentNode, visit: (node: ContentNode) => void): void {
  visit(node);
  node.children?.forEach((child) => walk(child, visit));
}

async function checkImage(
  source: string,
  directory: string,
  filename: string
): Promise<void> {
  if (/^(?:https?:\/\/|\/\/|data:)/i.test(source)) return;
  const local = source.replace(/^(?:\.\/)?images\/|^\/blog-assets\//, '');
  if (local === source || !BLOG_IMAGE_PATTERN.test(local))
    throw new Error(`[blog] ${filename}: unsupported local image ${source}`);
  try {
    if (!(await stat(path.join(directory, 'images', local))).isFile())
      throw new Error('not a file');
  } catch {
    throw new Error(`[blog] ${filename}: missing image ${source}`);
  }
}

function imageValidation(directory: string, filename: string) {
  return () => async (tree: ContentNode) => {
    const definitions = new Map<string, string>();
    const images: string[] = [];
    walk(tree, (node) => {
      if (node.type === 'definition' && node.identifier && node.url)
        definitions.set(node.identifier, node.url);
    });
    walk(tree, (node) => {
      if (node.type === 'image' && node.url) images.push(node.url);
      if (node.type === 'imageReference' && node.identifier) {
        const source = definitions.get(node.identifier);
        if (source) images.push(source);
      }
      if (node.name === 'img' && node.type.startsWith('mdxJsx')) {
        const source = node.attributes?.find(
          (attribute) =>
            attribute.type === 'mdxJsxAttribute' && attribute.name === 'src'
        );
        if (typeof source?.value === 'string') images.push(source.value);
        else
          throw new Error(
            `[blog] ${filename}: image src must be a static string`
          );
      }
    });
    await Promise.all(
      images.map((source) => checkImage(source, directory, filename))
    );
  };
}

export async function validateBlogDirectory(
  directory: string
): Promise<number> {
  const entries = await readdir(directory, {
    withFileTypes: true,
    recursive: true,
  });
  let count = 0;
  const posts: PostMeta[] = [];
  for (const entry of entries) {
    if (!entry.name.endsWith('.mdx')) continue;
    const relative = path.relative(
      directory,
      path.join(entry.parentPath, entry.name)
    );
    if (!entry.isFile() || !/^[a-zA-Z0-9][a-zA-Z0-9_-]*\.mdx$/.test(relative))
      throw new Error(`[blog] ${relative}: invalid article filename`);
    const post = parsePost(
      await readFile(path.join(directory, entry.name), 'utf8'),
      entry.name
    );
    try {
      await compile(post.content, {
        remarkPlugins: [remarkGfm, imageValidation(directory, entry.name)],
      });
      if (post.image) await checkImage(post.image, directory, entry.name);
    } catch (error) {
      throw new Error(
        `[blog] ${entry.name}: invalid MDX: ${error instanceof Error ? error.message : String(error)}`
      );
    }
    count++;
    posts.push(post);
  }
  validateSeries(posts);
  return count;
}
