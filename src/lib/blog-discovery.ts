import type { Metadata } from 'next';
import type { PostMeta } from '@/types/blog';

export const SITE_URL = 'https://klh.app';
export const BLOG_URL = `${SITE_URL}/en/blog`;
export const FEED_URL = `${SITE_URL}/feed.xml`;

export function articleUrl(slug: string): string {
  return `${BLOG_URL}/${encodeURIComponent(slug)}`;
}

function xml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;',
      })[character]!
  );
}

export function createBlogFeed(posts: PostMeta[]): string {
  const items = posts
    .filter((post) => !post.draft)
    .map(
      (post) => `<item>
<title>${xml(post.title)}</title>
<link>${xml(articleUrl(post.slug))}</link>
<guid isPermaLink="true">${xml(articleUrl(post.slug))}</guid>
<description>${xml(post.description)}</description>
<pubDate>${new Date(post.date).toUTCString()}</pubDate>
${post.tags.map((tag) => `<category>${xml(tag)}</category>`).join('\n')}
</item>`
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
<title>KL Hsu Blog</title><link>${BLOG_URL}</link>
<description>Project showcases and technical writing</description><language>en</language>
<atom:link href="${FEED_URL}" rel="self" type="application/rss+xml"/>
${items}
</channel></rss>`;
}

export function getArticleMetadata(post: PostMeta): Metadata {
  if (post.draft) return { robots: { index: false, follow: false } };
  const url = articleUrl(post.slug);
  const images = post.image
    ? [new URL(post.image, SITE_URL).toString()]
    : undefined;
  return {
    title: `${post.title} — KL Hsu`,
    description: post.description,
    authors: [{ name: 'KL Hsu', url: SITE_URL }],
    alternates: { canonical: url, types: { 'application/rss+xml': FEED_URL } },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      url,
      siteName: 'KL Hsu',
      locale: 'en_US',
      publishedTime: `${post.date}T00:00:00.000Z`,
      ...(post.updated && { modifiedTime: `${post.updated}T00:00:00.000Z` }),
      authors: ['KL Hsu'],
      tags: post.tags,
      ...(images && { images }),
    },
    twitter: {
      card: images ? 'summary_large_image' : 'summary',
      title: post.title,
      description: post.description,
      ...(images && { images }),
    },
  };
}
