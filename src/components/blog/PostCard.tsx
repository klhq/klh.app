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
      'group rounded-xl border p-5 transition-all duration-200',
      'border-slate-200/60 bg-white/60 backdrop-blur-sm',
      'hover:border-theme-500/40 hover:shadow-md',
      'dark:border-white/5 dark:bg-slate-900/40',
      'dark:hover:border-theme-400/30'
    )}
  >
    <div className="flex items-start justify-between">
      <div>
        <div className="mb-2 font-mono text-[10px] text-slate-400 dark:text-slate-500">
          {new Date(post.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
        <h2
          className={clsx(
            'mb-1 text-sm font-semibold text-slate-900 transition-colors',
            'group-hover:text-theme-600',
            'dark:text-slate-100 dark:group-hover:text-theme-400'
          )}
        >
          {post.title}
        </h2>
        <p className="mb-3 text-xs text-slate-500 dark:text-slate-400">
          {post.description}
        </p>
      </div>
      <span className="mt-2 text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5 dark:text-slate-600">
        →
      </span>
    </div>
    <div className="flex flex-wrap gap-1.5">
      {post.tags.map((tag) => (
        <span
          key={tag}
          className={clsx(
            'rounded-md px-1.5 py-0.5 font-mono text-[10px]',
            'bg-slate-100 text-slate-500',
            'dark:bg-white/5 dark:text-slate-400'
          )}
        >
          {tag}
        </span>
      ))}
    </div>
  </Link>
);

export default PostCard;
