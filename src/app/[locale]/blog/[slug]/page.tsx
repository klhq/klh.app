import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import MdxContent from '@/components/blog/MdxContent';
import clsx from 'clsx';
import { getArticleMetadata } from '@/lib/blog-discovery';
import { isPreviewMode } from '@/lib/preview';
import PostDetails from '@/components/blog/PostDetails';

interface PostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts(undefined, {
    includeDrafts: isPreviewMode(),
  });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug, undefined, {
    includeDrafts: isPreviewMode(),
  });
  if (!post) notFound();
  return getArticleMetadata(post);
}

export default async function PostPage({ params }: PostPageProps) {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, undefined, {
    includeDrafts: isPreviewMode(),
  });

  if (!post) notFound();

  return (
    <div
      className={clsx(
        'relative min-h-screen bg-slate-50 px-4 py-16',
        'dark:bg-slate-950'
      )}
    >
      <div className="mx-auto w-full max-w-3xl">
        <Link
          href={`/${locale}/blog`}
          className={clsx(
            'group mb-8 inline-flex items-center gap-1 text-sm text-slate-400 transition-colors',
            'hover:text-theme-600',
            'dark:hover:text-theme-400 dark:text-slate-500'
          )}
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
            ←
          </span>
          Back to blog
        </Link>

        <header className="animate-fade-in-down mb-8">
          {post.draft && (
            <p className="mb-3 font-mono text-xs text-amber-700 dark:text-amber-400">
              Draft preview · Not published
            </p>
          )}
          <div className="mb-2">
            <PostDetails post={post} locale={locale} />
          </div>
          <h1
            className={clsx(
              'mb-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl',
              'dark:text-slate-50'
            )}
          >
            {post.title}
          </h1>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/${locale}/blog?tag=${encodeURIComponent(tag)}`}
                className="tag-pill hover:text-theme-600 dark:hover:text-theme-400 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </header>

        <div className="animate-fade-in-up">
          <MdxContent source={post.content} title={post.title} />
        </div>
      </div>
    </div>
  );
}
