import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts, getPostBySlug } from '@/lib/blog';
import MdxContent from '@/components/blog/MdxContent';
import clsx from 'clsx';

interface PostPageProps {
  params: Promise<{ locale: string; slug: string }>;
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
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div
      className={clsx(
        'relative min-h-screen bg-slate-50 px-4 py-16',
        'dark:bg-slate-950'
      )}
    >
      <div className="mx-auto w-full max-w-md">
        <Link
          href={`/${locale}/blog`}
          className={clsx(
            'group mb-8 inline-flex items-center gap-1 text-sm text-slate-400 transition-colors',
            'hover:text-theme-600',
            'dark:text-slate-500 dark:hover:text-theme-400'
          )}
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
            ←
          </span>
          Back to blog
        </Link>

        <header className="animate-fade-in-down mb-8">
          <div className="mb-2 font-mono text-[10px] text-slate-400 dark:text-slate-500">
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
          <h1
            className={clsx(
              'mb-4 text-2xl font-bold tracking-tight text-slate-900',
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
                className="tag-pill transition-colors hover:text-theme-600 dark:hover:text-theme-400"
              >
                {tag}
              </Link>
            ))}
          </div>
        </header>

        <div className="animate-fade-in-up">
          <MdxContent source={post.content} />
        </div>
      </div>
    </div>
  );
}
