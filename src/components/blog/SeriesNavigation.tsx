import Link from 'next/link';
import type { PostMeta } from '@/types/blog';
import type { BlogReadingOptions } from '@/lib/blog';
import { getSeriesNavigation } from '@/lib/blog-series';

export default function SeriesNavigation({
  post,
  posts,
  locale,
  options,
}: {
  post: PostMeta;
  posts: PostMeta[];
  locale: string;
  options?: BlogReadingOptions;
}) {
  const series = getSeriesNavigation(post, posts, options);
  if (!series) return null;
  return (
    <details
      open
      className="mb-8 rounded-xl border border-slate-200 bg-white/50 p-5 dark:border-slate-800 dark:bg-slate-900/50"
    >
      <summary className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-200">
        {series.title}{' '}
        <span className="ml-2 font-mono text-[10px] text-slate-400">
          Part {series.position} of {series.parts.length}
        </span>
      </summary>
      <nav aria-label="Series articles" className="mt-4">
        <ol className="space-y-2 text-sm">
          {series.parts.map((part, index) => (
            <li key={part.slug} className="flex gap-3">
              <span
                aria-hidden="true"
                className="font-mono text-xs text-slate-400"
              >
                {index + 1}.
              </span>
              {part.slug === post.slug ? (
                <span
                  aria-current="page"
                  className="text-theme-600 dark:text-theme-400 font-medium"
                >
                  {part.title}
                  {part.draft ? ' · Draft' : ''}
                </span>
              ) : (
                <Link
                  href={`/${locale}/blog/${part.slug}`}
                  className="hover:text-theme-600 dark:hover:text-theme-400 text-slate-500 dark:text-slate-400"
                >
                  {part.title}
                  {part.draft ? ' · Draft' : ''}
                </Link>
              )}
            </li>
          ))}
        </ol>
        {(series.previous || series.next) && (
          <div className="mt-4 flex flex-wrap justify-between gap-3 border-t border-slate-200 pt-4 text-xs dark:border-slate-800">
            {series.previous && (
              <Link
                href={`/${locale}/blog/${series.previous.slug}`}
                className="text-theme-600 dark:text-theme-400"
              >
                ← Previous in series
              </Link>
            )}
            {series.next && (
              <Link
                href={`/${locale}/blog/${series.next.slug}`}
                className="text-theme-600 dark:text-theme-400 ml-auto"
              >
                Next in series →
              </Link>
            )}
          </div>
        )}
      </nav>
    </details>
  );
}
