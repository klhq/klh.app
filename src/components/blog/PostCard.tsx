import { FC } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import clsx from 'clsx';
import type { PostMeta } from '@/types/blog';

interface PostCardProps {
  post: PostMeta;
  locale: string;
}

const PostCard: FC<PostCardProps> = ({ post, locale }) => (
  <Link href={`/${locale}/blog/${post.slug}`} className="glass-card-interactive group p-5">
    <div className="flex items-start justify-between">
      <div>
        <div className="mb-2 font-mono text-[10px] text-slate-400 dark:text-slate-500">
          {new Date(post.date).toLocaleDateString(locale, {
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
      <span className="hover-arrow mt-2 inline-flex items-center">
        <ArrowRight className="size-4" />
      </span>
    </div>
    <div className="flex flex-wrap gap-1.5">
      {post.tags.map((tag) => (
        <Badge key={tag} variant="secondary" className="font-mono text-[10px]">
          {tag}
        </Badge>
      ))}
    </div>
  </Link>
);

export default PostCard;
