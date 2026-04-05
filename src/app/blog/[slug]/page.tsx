import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import MdxContent from '@/components/blog/MdxContent';
import clsx from 'clsx';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: `${post.title} — KL Hsu`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      ...(post.image && { images: [post.image] }),
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div
      className={clsx(
        'mx-auto min-h-screen max-w-3xl px-6 py-12',
        'md:px-8 md:py-16'
      )}
    >
      <Link
        href="/blog"
        className={clsx(
          'mb-8 inline-flex items-center gap-1 text-sm text-slate-500 transition-colors',
          'hover:text-theme-600',
          'dark:text-slate-400 dark:hover:text-theme-400'
        )}
      >
        &larr; Back to blog
      </Link>

      <header className="mb-8">
        <div className="mb-2 font-mono text-xs text-slate-400 dark:text-slate-500">
          {new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>
        <h1
          className={clsx(
            'mb-4 text-3xl font-extrabold tracking-tighter text-slate-900',
            'dark:text-slate-50',
            'sm:text-4xl'
          )}
        >
          {post.title}
        </h1>
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <Link
              key={tag}
              href={`/blog?tag=${encodeURIComponent(tag)}`}
              className={clsx(
                'rounded-md border border-slate-200 px-2 py-0.5 font-mono text-xs text-slate-500 transition-colors',
                'hover:border-theme-500/50 hover:text-theme-600',
                'dark:border-white/10 dark:text-slate-400 dark:hover:text-theme-400'
              )}
            >
              {tag}
            </Link>
          ))}
        </div>
      </header>

      <MdxContent source={post.content} />
    </div>
  );
}
