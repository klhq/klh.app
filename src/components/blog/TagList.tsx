import { FC } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

interface TagListProps {
  tags: string[];
  activeTag?: string;
  counts?: Map<string, number>;
}

const TagList: FC<TagListProps> = ({ tags, activeTag, counts }) => (
  <div className="flex flex-wrap gap-1.5">
    {activeTag && (
      <Link
        href="/blog"
        className={clsx(
          'rounded-md px-2 py-0.5 font-mono text-[10px] transition-colors',
          'bg-slate-100 text-slate-500 hover:text-slate-700',
          'dark:bg-white/5 dark:text-slate-400 dark:hover:text-slate-200'
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
            'rounded-md px-2 py-0.5 font-mono text-[10px] transition-colors',
            isActive
              ? 'bg-theme-500/15 text-theme-600 dark:text-theme-400'
              : 'bg-slate-100 text-slate-500 hover:text-slate-700 dark:bg-white/5 dark:text-slate-400 dark:hover:text-slate-200'
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
