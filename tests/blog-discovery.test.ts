import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createBlogFeed, getArticleMetadata } from '../src/lib/blog-discovery';

test('RSS escapes author text and includes only published articles at canonical URLs', () => {
  const article = { slug: 'public', title: 'A & B <C>', description: '"Example" & details', date: '2026-10-10', tags: ['a&b'] };
  const xml = createBlogFeed([article, { ...article, slug: 'private', draft: true }]);
  assert.ok(xml.includes('https://klh.app/en/blog/public'));
  assert.ok(xml.includes('A &amp; B &lt;C&gt;'));
  assert.ok(xml.includes('&quot;Example&quot; &amp; details'));
  assert.ok(!xml.includes('/private'));
});

test('article metadata has one English canonical URL and publication details', () => {
  const metadata = getArticleMetadata({ slug: 'example', title: 'Example', description: 'Details', date: '2026-10-10', tags: ['code'], image: '/cover.png' });
  assert.equal(metadata.alternates?.canonical, 'https://klh.app/en/blog/example');
  assert.deepEqual(metadata.authors, [{ name: 'KL Hsu', url: 'https://klh.app' }]);
  assert.deepEqual(metadata.openGraph?.images, ['https://klh.app/cover.png']);
  assert.equal(metadata.openGraph && 'publishedTime' in metadata.openGraph ? metadata.openGraph.publishedTime : undefined, '2026-10-10T00:00:00.000Z');
});
