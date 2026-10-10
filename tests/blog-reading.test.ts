import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePost } from '../src/lib/blog-frontmatter';

const raw = (extra: string, body = 'word '.repeat(440)) =>
  `---\ntitle: Article\ndescription: Example\ndate: '2026-10-10'\n${extra}\n---\n${body}`;

test('reading metadata calculates minutes and validates updated calendar dates', () => {
  const post = parsePost(raw("updated: '2026-10-11'"), 'article');
  assert.equal(post.readingMinutes, 2);
  assert.equal(post.updated, '2026-10-11');
  assert.throws(
    () => parsePost(raw("updated: '2026-02-30'"), 'article'),
    /article.*updated/
  );
  assert.throws(
    () => parsePost(raw("updated: '2026-10-09'"), 'article'),
    /article.*updated/
  );
});
