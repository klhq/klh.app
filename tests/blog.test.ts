import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { getAllPosts, getPostBySlug } from '../src/lib/blog';

test('draft articles are unavailable by direct slug and in listings', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'blog-'));
  try {
    await writeFile(path.join(dir, 'private.mdx'), '---\ntitle: Private\ndescription: Secret\ndate: "2026-10-10"\ntags: []\ndraft: true\n---\nSecret body');
    assert.equal(await getPostBySlug('private', dir), null);
    assert.deepEqual(await getAllPosts(dir), []);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('invalid article dates fail with the slug and field instead of rendering', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'blog-'));
  try {
    await writeFile(path.join(dir, 'broken.mdx'), '---\ntitle: Broken\ndescription: Example\ndate: "2026-02-30"\ntags: []\n---\nBody');
    await assert.rejects(getPostBySlug('broken', dir), /broken.*date/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
