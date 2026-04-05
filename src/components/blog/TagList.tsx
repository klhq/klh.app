import { FC } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

interface TagListProps {
  tags: string[];
  activeTag?: string;
  counts?: Map<string, number>;
}

const TagList: FC<TagListProps> = ({ tags, activeTag, counts }) => (
  <div className="flex flex-wrap gap-2">
    {activeTag && (
      <Link
        href="/blog"
        className={clsx(
          'rounded-md border border-slate-200 px-2.5 py-1 font-mono text-xs transition-colors',
          'hover:bg-slate-100',
          'dark:border-white/10 dark:hover:bg-slate-800'
        )}
      >
        All
      </Link>
    )}
    {tags.map((tag) => {
      const isActive = tag === activeTag;
      return (
        <Link
          key={tag}
          href={isActive ? '/blog' : `/blog?tag=${encodeURIComponent(tag)}`}
          className={clsx(
            'rounded-md border px-2.5 py-1 font-mono text-xs transition-colors',
            isActive
              ? 'border-theme-500/50 bg-theme-600/10 text-theme-600 dark:bg-theme-400/20 dark:text-theme-400'
              : 'border-slate-200 hover:bg-slate-100 dark:border-white/10 dark:hover:bg-slate-800'
          )}
        >
          {tag}
          {counts && (
            <span className="ml-1 text-slate-400 dark:text-slate-500">
              {counts.get(tag)}
            </span>
          )}
        </Link>
      );
    })}
  </div>
);

export default TagList;
