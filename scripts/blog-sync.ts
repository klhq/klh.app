import { mkdir, mkdtemp, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parsePost } from '../src/lib/blog-frontmatter';
import { validateSeries } from '../src/lib/blog-series';
import type { PostMeta } from '../src/types/blog';

export async function syncBlogDirectory(
  output: string,
  files: string[],
  download: (file: string) => Promise<string | Uint8Array>
): Promise<void> {
  const names = files.map((file) => file.replace(/^blog\//, ''));
  for (const name of names) {
    if (
      !/^[a-zA-Z0-9][a-zA-Z0-9_-]*\.mdx$/.test(name) &&
      !/^images\/[a-zA-Z0-9][a-zA-Z0-9_.-]*\.(png|jpe?g|gif|webp|avif)$/.test(
        name
      )
    )
      throw new Error(`[blog] Invalid filename: ${name}`);
  }
  if (new Set(names).size !== names.length)
    throw new Error('[blog] Duplicate article filenames');
  await mkdir(path.dirname(output), { recursive: true });
  const staging = await mkdtemp(`${output}-staging-`);
  const backup = `${staging}-previous`;
  let movedPrevious = false;
  const posts: PostMeta[] = [];
  try {
    const results = await Promise.allSettled(
      files.map(async (file, index) => {
        const raw = await download(file);
        if (names[index].endsWith('.mdx'))
          posts.push(
            parsePost(
              typeof raw === 'string' ? raw : Buffer.from(raw).toString('utf8'),
              names[index].slice(0, -4)
            )
          );
        const target = path.join(staging, names[index]);
        await mkdir(path.dirname(target), { recursive: true });
        await writeFile(target, raw);
      })
    );
    const failure = results.find((result) => result.status === 'rejected');
    if (failure?.status === 'rejected') throw failure.reason;
    validateSeries(posts);
    try {
      await rename(output, backup);
      movedPrevious = true;
    } catch (error) {
      if (
        !(error instanceof Error && 'code' in error && error.code === 'ENOENT')
      )
        throw error;
    }
    try {
      await rename(staging, output);
    } catch (error) {
      if (movedPrevious) await rename(backup, output);
      throw error;
    }
    if (movedPrevious) await rm(backup, { recursive: true, force: true });
  } finally {
    await rm(staging, { recursive: true, force: true });
  }
}
