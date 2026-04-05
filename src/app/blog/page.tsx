import type { Metadata } from 'next';
import { getAllPosts, getAllTags } from '@/lib/blog';
import PostCard from '@/components/blog/PostCard';
import TagList from '@/components/blog/TagList';
import clsx from 'clsx';

export const metadata: Metadata = {
  title: 'Blog — KL Hsu',
  description: 'Project showcases and technical writing',
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const { tag } = await searchParams;
  const [posts, tagCounts] = await Promise.all([getAllPosts(), getAllTags()]);

  const filteredPosts = tag
    ? posts.filter((p) => p.tags.includes(tag))
    : posts;

  const sortedTags = [...tagCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([t]) => t);

  return (
    <div
      className={clsx(
        'mx-auto min-h-screen max-w-3xl px-6 py-12',
        'md:px-8 md:py-16'
      )}
    >
      <header className="mb-12">
        <h1
          className={clsx(
            'mb-2 text-3xl font-extrabold tracking-tighter text-slate-900',
            'dark:text-slate-50',
            'sm:text-4xl'
          )}
        >
          Blog
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400">
          Project showcases and technical writing
        </p>
      </header>

      {sortedTags.length > 0 && (
        <div className="mb-8">
          <TagList tags={sortedTags} activeTag={tag} counts={tagCounts} />
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400">
          No posts found{tag ? ` for tag "${tag}"` : ''}.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
