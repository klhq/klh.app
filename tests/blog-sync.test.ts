import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { syncBlogDirectory } from '../scripts/blog-sync';

test('failed downloads preserve the previous complete blog', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'blog-sync-'));
  const output = path.join(dir, 'blog');
  try {
    await mkdir(output);
    await writeFile(path.join(output, 'old.mdx'), 'Previous article');
    await assert.rejects(
      syncBlogDirectory(output, ['new.mdx'], async () => {
        throw new Error('Download failed');
      }),
      /Download failed/
    );
    assert.equal(
      await readFile(path.join(output, 'old.mdx'), 'utf8'),
      'Previous article'
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('article images retain their bytes and relative image directory', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'blog-sync-'));
  const output = path.join(dir, 'blog');
  const bytes = new Uint8Array([71, 73, 70, 56, 57, 97, 255]);
  try {
    await syncBlogDirectory(
      output,
      ['blog/images/hero.gif'],
      async () => bytes
    );
    assert.deepEqual(
      new Uint8Array(await readFile(path.join(output, 'images/hero.gif'))),
      bytes
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('complete synchronization replaces deleted posts and supports an empty blog', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'blog-sync-'));
  const output = path.join(dir, 'blog');
  try {
    await mkdir(output);
    await writeFile(path.join(output, 'old.mdx'), 'Previous article');
    const article =
      '---\ntitle: New\ndescription: Example\ndate: "2026-10-10"\ntags: []\n---\nNew body';
    await syncBlogDirectory(output, ['blog/new.mdx'], async () => article);
    assert.deepEqual(await readdir(output), ['new.mdx']);
    assert.equal(await readFile(path.join(output, 'new.mdx'), 'utf8'), article);
    await syncBlogDirectory(output, [], async () => {
      throw new Error('No downloads expected');
    });
    assert.deepEqual(await readdir(output), []);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('invalid downloaded content preserves cached articles', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'blog-sync-'));
  const output = path.join(dir, 'blog');
  try {
    await mkdir(output);
    await writeFile(path.join(output, 'old.mdx'), 'Previous article');
    await assert.rejects(
      syncBlogDirectory(output, ['broken.mdx'], async () => 'No frontmatter'),
      /broken.*date/
    );
    assert.deepEqual(await readdir(output), ['old.mdx']);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
