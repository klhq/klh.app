import { getAllPosts } from '@/lib/blog';
import { createBlogFeed } from '@/lib/blog-discovery';

export const dynamic = 'force-static';

export async function GET() {
  return new Response(createBlogFeed(await getAllPosts()), {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
