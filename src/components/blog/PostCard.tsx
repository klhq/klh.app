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
import PostDetails from './PostDetails';

interface PostCardProps {
  post: PostMeta;
  locale: string;
}

const PostCard: FC<PostCardProps> = ({ post, locale }) => (
  <Link href={`/${locale}/blog/${post.slug}`} className="block">
    <Card className="glass-card-interactive group gap-3 bg-transparent p-5 pb-5 ring-0">
      <CardHeader className="gap-1.5 p-0">
        {post.draft && (
          <p className="font-mono text-[10px] text-amber-700 dark:text-amber-400">
            Draft preview
          </p>
        )}
        <PostDetails post={post} locale={locale} />
        <CardTitle
          render={<h2 />}
          className={clsx(
            'text-sm font-semibold text-slate-900 transition-colors',
            'group-hover:text-theme-600',
            'dark:group-hover:text-theme-400 dark:text-slate-100'
          )}
        >
          {post.title}
        </CardTitle>
        <CardDescription className="text-xs text-slate-500 dark:text-slate-400">
          {post.description}
        </CardDescription>
        <CardAction className="row-span-2 row-start-1 mt-1 self-start">
          <span className="hover-arrow inline-flex items-center">
            <ArrowRight className="size-4" />
          </span>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex flex-wrap gap-1.5 border-0 bg-transparent p-0">
        {post.tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="font-mono text-[10px]"
          >
            {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  </Link>
);

export default PostCard;
