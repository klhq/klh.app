import { FC } from 'react';
import Link from 'next/link';
import clsx from 'clsx';

interface TagListProps {
  tags: string[];
  activeTag?: string;
  counts?: Map<string, number>;
  locale: string;
}

const TagList: FC<TagListProps> = ({ tags, activeTag, counts, locale }) => (
  <div className="flex flex-wrap gap-1.5">
    {activeTag && (
      <Link
        href={`/${locale}/blog`}
        className="tag-pill transition-colors hover:text-slate-700 dark:hover:text-slate-200"
      >
        All
      </Link>
    )}
    {tags.map((tag) => {
      const isActive = tag === activeTag;
      return (
        <Link
          key={tag}
          href={isActive ? `/${locale}/blog` : `/${locale}/blog?tag=${encodeURIComponent(tag)}`}
          className={clsx(
            'tag-pill transition-colors',
            isActive
              ? 'bg-theme-500/15 text-theme-600 dark:text-theme-400'
              : 'hover:text-slate-700 dark:hover:text-slate-200'
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
