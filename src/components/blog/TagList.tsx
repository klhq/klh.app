import { FC } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
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
      <Link href={`/${locale}/blog`}>
        <Badge
          variant="outline"
          className="cursor-pointer font-mono text-[10px] text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          All
        </Badge>
      </Link>
    )}
    {tags.map((tag) => {
      const isActive = tag === activeTag;
      return (
        <Link
          key={tag}
          href={isActive ? `/${locale}/blog` : `/${locale}/blog?tag=${encodeURIComponent(tag)}`}
        >
          <Badge
            variant={isActive ? 'default' : 'secondary'}
            className={clsx(
              'cursor-pointer font-mono text-[10px] transition-colors',
              isActive
                ? 'bg-theme-500/15 text-theme-600 hover:bg-theme-500/25 dark:text-theme-400 border-transparent'
                : 'hover:text-slate-700 dark:hover:text-slate-200'
            )}
          >
            {tag}
            {counts && (
              <span className="ml-1 opacity-70">
                {counts.get(tag)}
              </span>
            )}
          </Badge>
        </Link>
      );
    })}
  </div>
);

export default TagList;
