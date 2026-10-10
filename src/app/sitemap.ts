import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/blog';
import { articleUrl, BLOG_URL, SITE_URL } from '@/lib/blog-discovery';
import { routing } from '@/i18n/routing';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = routing.locales.flatMap((locale) => ['', '/resume'].map((suffix) => ({ url: `${SITE_URL}/${locale}${suffix}` })));
  const posts = await getAllPosts();
  return [...pages, { url: BLOG_URL }, ...posts.map((post) => ({ url: articleUrl(post.slug), lastModified: post.date }))];
}
