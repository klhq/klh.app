import type { PostMeta } from '@/types/blog';
import type { BlogReadingOptions } from './blog';

export function validateSeries(posts: PostMeta[]): void {
  const series = new Map<
    string,
    { title: string; orders: Map<number, string> }
  >();
  for (const post of posts) {
    if (!post.series) continue;
    const { id, title, order } = post.series;
    const group = series.get(id) ?? {
      title,
      orders: new Map<number, string>(),
    };
    if (group.title !== title)
      throw new Error(
        `[blog] Series ${id}: inconsistent title in ${post.slug}`
      );
    if (group.orders.has(order))
      throw new Error(
        `[blog] Series ${id}: duplicate order ${order} (${group.orders.get(order)}, ${post.slug})`
      );
    group.orders.set(order, post.slug);
    series.set(id, group);
  }
}

export function getSeriesNavigation(
  current: PostMeta,
  posts: PostMeta[],
  options: BlogReadingOptions = {}
) {
  if (!current.series) return null;
  const parts = posts
    .filter(
      (post) =>
        post.series?.id === current.series?.id &&
        (options.includeDrafts || !post.draft)
    )
    .sort((a, b) => a.series!.order - b.series!.order);
  const index = parts.findIndex((post) => post.slug === current.slug);
  if (index < 0) return null;
  return {
    title: current.series.title,
    parts,
    position: index + 1,
    previous: parts[index - 1],
    next: parts[index + 1],
  };
}
