import type { PostMeta } from '@/types/blog';
import { formatBlogDate } from '@/lib/blog-reading';

export default function PostDetails({
  post,
  locale,
}: {
  post: PostMeta;
  locale: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] text-slate-400 dark:text-slate-500">
      <time dateTime={post.date}>{formatBlogDate(post.date, locale)}</time>
      {post.readingMinutes !== undefined && (
        <span>{post.readingMinutes} min read</span>
      )}
      {post.updated && (
        <span>
          Updated{' '}
          <time dateTime={post.updated}>
            {formatBlogDate(post.updated, locale)}
          </time>
        </span>
      )}
    </div>
  );
}
