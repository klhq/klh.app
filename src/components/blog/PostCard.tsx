import { FC } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import type { PostMeta } from '@/types/blog';

interface PostCardProps {
  post: PostMeta;
}

const PostCard: FC<PostCardProps> = ({ post }) => (
  <Link
    href={`/blog/${post.slug}`}
    className={clsx(
      'group block rounded-lg border border-slate-200 p-6 transition-all duration-200',
      'hover:shadow-theme-600/10 hover:scale-[1.01] hover:border-slate-300 hover:shadow-lg',
      'dark:border-white/5 dark:bg-slate-800/30 dark:hover:border-white/10'
    )}
  >
    <div className="mb-2 font-mono text-xs text-slate-400 dark:text-slate-500">
      {new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}
    </div>
    <h2
      className={clsx(
        'mb-2 text-lg font-bold tracking-tight text-slate-800',
        'group-hover:text-theme-600',
        'dark:text-slate-100 dark:group-hover:text-theme-400'
      )}
    >
      {post.title}
    </h2>
    <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
      {post.description}
    </p>
    <div className="flex flex-wrap gap-1.5">
      {post.tags.map((tag) => (
        <span
          key={tag}
          className={clsx(
            'rounded-md border border-slate-200 px-2 py-0.5 font-mono text-xs text-slate-500',
            'dark:border-white/10 dark:text-slate-400'
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  </Link>
);

export default PostCard;
