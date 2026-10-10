import { mkdir, mkdtemp, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parsePost } from '../src/lib/blog-frontmatter';

export async function syncBlogDirectory(output: string, files: string[], download: (file: string) => Promise<string>): Promise<void> {
  const names = files.map((file) => path.basename(file));
  if (new Set(names).size !== names.length) throw new Error('[blog] Duplicate article filenames');
  await mkdir(path.dirname(output), { recursive: true });
  const staging = await mkdtemp(`${output}-staging-`);
  const backup = `${staging}-previous`;
  let movedPrevious = false;
  try {
    const results = await Promise.allSettled(files.map(async (file, index) => {
      const raw = await download(file);
      const slug = names[index].slice(0, -4);
      if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(slug)) throw new Error(`[blog] Invalid filename: ${file}`);
      parsePost(raw, slug);
      await writeFile(path.join(staging, names[index]), raw, 'utf8');
    }));
    const failure = results.find((result) => result.status === 'rejected');
    if (failure?.status === 'rejected') throw failure.reason;
    try {
      await rename(output, backup);
      movedPrevious = true;
    } catch (error) {
      if (!(error instanceof Error && 'code' in error && error.code === 'ENOENT')) throw error;
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
