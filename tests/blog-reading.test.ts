import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePost } from '../src/lib/blog-frontmatter';
import { getArticleNavigation } from '../src/lib/blog-navigation';
import type { PostMeta } from '../src/types/blog';

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

const post = (
  slug: string,
  date: string,
  tags: string[] = [],
  draft = false
): PostMeta => ({
  slug,
  title: slug,
  description: 'Example',
  date,
  tags,
  draft,
});

test('footer navigation orders articles and ranks related posts without revealing drafts', () => {
  const current = post('current', '2026-10-10', ['code', 'design']);
  const posts = [
    current,
    post('older', '2026-10-09', ['code']),
    post('newer', '2026-10-11', ['code', 'design']),
    post('unrelated', '2026-10-08'),
    post('secret', '2026-10-12', ['code', 'design'], true),
  ];
  const navigation = getArticleNavigation(current, posts);
  assert.equal(navigation.previous?.slug, 'older');
  assert.equal(navigation.next?.slug, 'newer');
  assert.deepEqual(
    navigation.related.map((p) => p.slug),
    ['newer', 'older']
  );
  assert.ok(
    getArticleNavigation(current, posts, { includeDrafts: true }).related.some(
      (p) => p.slug === 'secret'
    )
  );
});

test('project links accept web URLs and reject executable URL schemes', () => {
  const parsed = parsePost(
    raw(
      'links:\n  github: https://github.com/klhq/demo\n  demo: https://example.com/demo'
    ),
    'article'
  );
  assert.equal(parsed.links?.github, 'https://github.com/klhq/demo');
  assert.equal(parsed.links?.demo, 'https://example.com/demo');
  assert.throws(
    () => parsePost(raw('links:\n  demo: javascript:alert(1)'), 'article'),
    /article.*links.demo/
  );
  assert.throws(
    () => parsePost(raw('links: wrong'), 'article'),
    /article.*links/
  );
});
