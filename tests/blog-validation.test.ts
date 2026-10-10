import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { validateBlogDirectory } from '../scripts/blog-validation';

const article = (body: string) =>
  '---\ntitle: Draft\ndescription: Example\ndate: "2026-10-10"\ndraft: true\n---\n' +
  body;

async function fixture(run: (directory: string) => Promise<void>) {
  const directory = await mkdtemp(path.join(tmpdir(), 'blog-validation-'));
  try {
    await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test('validation rejects malformed MDX even when the article is a draft', async () => {
  await fixture(async (directory) => {
    await writeFile(path.join(directory, 'broken.mdx'), article('<Unclosed>'));
    await assert.rejects(validateBlogDirectory(directory), /broken\.mdx.*MDX/s);
  });
});

test('missing article images fail with the filename and reference', async () => {
  await fixture(async (directory) => {
    for (const body of [
      '![Demo](./images/missing.gif)',
      '![Demo][hero]\n\n[hero]: ./images/missing.gif',
      '<img src="./images/missing.gif" alt="Demo" />',
    ]) {
      await writeFile(path.join(directory, 'draft.mdx'), article(body));
      await assert.rejects(
        validateBlogDirectory(directory),
        /draft\.mdx.*missing.*images\/missing\.gif/s
      );
    }
    await mkdir(path.join(directory, 'images'));
    await writeFile(
      path.join(directory, 'images/missing.gif'),
      new Uint8Array([71, 73, 70])
    );
    assert.equal(await validateBlogDirectory(directory), 1);
  });
});

test('validation rejects nested article paths that the publisher cannot synchronize', async () => {
  await fixture(async (directory) => {
    await mkdir(path.join(directory, 'nested'));
    await writeFile(path.join(directory, 'nested/post.mdx'), article('Body'));
    await assert.rejects(
      validateBlogDirectory(directory),
      /nested\/post\.mdx.*filename/
    );
  });
});
