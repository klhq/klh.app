import type { PostMeta } from '@/types/blog';
import type { BlogReadingOptions } from './blog';

export function getArticleNavigation(
  current: PostMeta,
  posts: PostMeta[],
  options: BlogReadingOptions = {}
) {
  const visible = posts.filter((post) => options.includeDrafts || !post.draft);
  const chronological = [...visible].sort(
    (a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug)
  );
  const index = chronological.findIndex((post) => post.slug === current.slug);
  const tags = new Set(current.tags);
  const related = visible
    .filter((post) => post.slug !== current.slug)
    .map((post) => ({
      post,
      score: [...new Set(post.tags)].filter((tag) => tags.has(tag)).length,
    }))
    .filter((candidate) => candidate.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        b.post.date.localeCompare(a.post.date) ||
        a.post.slug.localeCompare(b.post.slug)
    )
    .slice(0, 3)
    .map((candidate) => candidate.post);
  return {
    previous: index > 0 ? chronological[index - 1] : undefined,
    next: index >= 0 ? chronological[index + 1] : undefined,
    related,
  };
}
