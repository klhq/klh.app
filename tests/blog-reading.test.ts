import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parsePost } from '../src/lib/blog-frontmatter';
import { getArticleNavigation } from '../src/lib/blog-navigation';
import type { PostMeta } from '../src/types/blog';
import { getSeriesNavigation, validateSeries } from '../src/lib/blog-series';
import {
  estimateReadingMinutes,
  formatBlogDate,
} from '../src/lib/blog-reading';

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

test('reading estimates cover CJK, mixed prose, empty articles and fenced code', () => {
  assert.equal(estimateReadingMinutes(''), 1);
  assert.equal(estimateReadingMinutes('文'.repeat(700)), 2);
  assert.equal(
    estimateReadingMinutes('word '.repeat(220) + '文'.repeat(350)),
    2
  );
  assert.equal(
    estimateReadingMinutes(
      'Short text\n```js\n' + 'code '.repeat(2000) + '\n```'
    ),
    1
  );
  assert.equal(formatBlogDate('2026-10-10', 'en-US'), 'Oct 10, 2026');
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

test('related articles stop at three with deterministic date and slug ties', () => {
  const current = post('current', '2026-10-10', ['code']);
  const navigation = getArticleNavigation(current, [
    current,
    post('c', '2026-10-09', ['code']),
    post('b', '2026-10-09', ['code']),
    post('a', '2026-10-09', ['code']),
    post('newest', '2026-10-11', ['code']),
  ]);
  assert.deepEqual(
    navigation.related.map((item) => item.slug),
    ['newest', 'a', 'b']
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

test('series metadata validates order and navigates visible parts rather than publication dates', () => {
  const current = parsePost(
    raw('series:\n  id: building-blog\n  title: Building a blog\n  order: 2'),
    'second'
  );
  assert.equal(current.series?.order, 2);
  assert.throws(
    () =>
      parsePost(
        raw(
          'series:\n  id: building-blog\n  title: Building a blog\n  order: 0'
        ),
        'bad'
      ),
    /bad.*series.order/
  );
  const first = {
    ...post('first', '2026-10-12'),
    series: { id: 'building-blog', title: 'Building a blog', order: 1 },
  };
  const secret = {
    ...post('secret-part', '2026-10-13', [], true),
    series: { id: 'building-blog', title: 'Building a blog', order: 3 },
  };
  const navigation = getSeriesNavigation(current, [secret, current, first]);
  assert.equal(navigation?.position, 2);
  assert.equal(navigation?.parts.length, 2);
  assert.equal(navigation?.previous?.slug, 'first');
  assert.equal(navigation?.next, undefined);
  assert.equal(
    getSeriesNavigation(current, [secret, current, first], {
      includeDrafts: true,
    })?.next?.slug,
    'secret-part'
  );
  assert.throws(
    () => validateSeries([first, { ...current, series: first.series }]),
    /building-blog.*duplicate.*1/
  );
  assert.throws(
    () =>
      validateSeries([
        first,
        { ...current, series: { ...current.series!, title: 'Other title' } },
      ]),
    /building-blog.*title/
  );
});
