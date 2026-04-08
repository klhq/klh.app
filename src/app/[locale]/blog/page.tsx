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
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ tag?: string }>;
}) {
  const { locale } = await params;
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
        'relative min-h-screen bg-slate-50 px-4 py-16',
        'dark:bg-slate-950'
      )}
    >
      <div className="mx-auto w-full max-w-md">
        <header className="animate-fade-in-down mb-8">
          <h2 className="section-label mb-3">
            Blog
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Project showcases and technical writing
          </p>
        </header>

        {sortedTags.length > 0 && (
          <div className="animate-fade-in-up mb-6">
            <TagList tags={sortedTags} activeTag={tag} counts={tagCounts} locale={locale} />
          </div>
        )}

        {filteredPosts.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No posts found{tag ? ` for tag "${tag}"` : ''}.
          </p>
        ) : (
          <div className="animate-fade-in-up flex flex-col gap-3">
            {filteredPosts.map((post) => (
              <PostCard key={post.slug} post={post} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
