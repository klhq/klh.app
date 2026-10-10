import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { getAllPosts, getPostBySlug } from '../src/lib/blog';

test('draft articles are unavailable by direct slug and in listings', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'blog-'));
  try {
    await writeFile(
      path.join(dir, 'private.mdx'),
      '---\ntitle: Private\ndescription: Secret\ndate: "2026-10-10"\ntags: []\ndraft: true\n---\nSecret body'
    );
    assert.equal(await getPostBySlug('private', dir), null);
    assert.deepEqual(await getAllPosts(dir), []);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('explicit draft preview includes drafts in listings and direct lookup', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'blog-preview-'));
  try {
    await writeFile(
      path.join(dir, 'private.mdx'),
      '---\ntitle: Private\ndescription: Secret\ndate: "2026-10-10"\ndraft: true\n---\nSecret body'
    );
    const options = { includeDrafts: true };
    assert.equal((await getPostBySlug('private', dir, options))?.draft, true);
    assert.deepEqual(
      (await getAllPosts(dir, options)).map((post) => post.slug),
      ['private']
    );
    assert.equal(await getPostBySlug('private', dir), null);
    assert.deepEqual(await getAllPosts(dir), []);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('invalid article dates fail with the slug and field instead of rendering', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'blog-'));
  try {
    await writeFile(
      path.join(dir, 'broken.mdx'),
      '---\ntitle: Broken\ndescription: Example\ndate: "2026-02-30"\ntags: []\n---\nBody'
    );
    await assert.rejects(getPostBySlug('broken', dir), /broken.*date/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('invalid unquoted YAML dates are rejected before YAML normalizes them', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'blog-'));
  try {
    await writeFile(
      path.join(dir, 'broken.mdx'),
      '---\ntitle: Broken\ndescription: Example\ndate: 2026-02-30\ntags: []\n---\nBody'
    );
    await assert.rejects(getPostBySlug('broken', dir), /broken.*date/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
