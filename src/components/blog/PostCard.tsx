import { FC } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardAction,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import clsx from 'clsx';
import type { PostMeta } from '@/types/blog';

interface PostCardProps {
  post: PostMeta;
  locale: string;
}

const PostCard: FC<PostCardProps> = ({ post, locale }) => (
  <Link href={`/${locale}/blog/${post.slug}`} className="block">
    <Card className="glass-card-interactive group p-5 gap-3">
      <CardHeader className="p-0 gap-1.5 has-data-[slot=card-action]:grid-cols-[1fr_auto]">
        <div className="font-mono text-[10px] text-slate-400 dark:text-slate-500">
          {new Date(post.date).toLocaleDateString(locale, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </div>
        <CardTitle
          className={clsx(
            'text-sm font-semibold text-slate-900 transition-colors',
            'group-hover:text-theme-600',
            'dark:text-slate-100 dark:group-hover:text-theme-400'
          )}
        >
          {post.title}
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
          {post.description}
        </CardDescription>
        <CardAction className="mt-1">
          <span className="hover-arrow inline-flex items-center">
            <ArrowRight className="size-4" />
          </span>
        </CardAction>
      </CardHeader>
      <CardFooter className="p-0 border-0 bg-transparent flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="font-mono text-[10px]">
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  </Link>
);

export default PostCard;
