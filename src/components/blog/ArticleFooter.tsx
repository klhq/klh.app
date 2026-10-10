import Link from 'next/link';
import type { PostMeta } from '@/types/blog';
import type { BlogReadingOptions } from '@/lib/blog';
import { getArticleNavigation } from '@/lib/blog-navigation';

export default function ArticleFooter({
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
  const { previous, next, related } = getArticleNavigation(
    post,
    posts,
    options
  );
  const articleLink = (item: PostMeta) => `/${locale}/blog/${item.slug}`;
  return (
    <footer className="mt-14 space-y-8 border-t border-slate-200 pt-8 dark:border-slate-800">
      {(post.links?.github || post.links?.demo) && (
        <nav aria-label="Project links" className="flex flex-wrap gap-3">
          {post.links.github && (
            <a
              href={post.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="tag-pill hover:text-theme-600 dark:hover:text-theme-400"
            >
              GitHub ↗
            </a>
          )}
          {post.links.demo && (
            <a
              href={post.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="tag-pill hover:text-theme-600 dark:hover:text-theme-400"
            >
              Live demo ↗
            </a>
          )}
        </nav>
      )}
      {(previous || next) && (
        <nav
          aria-label="Article navigation"
          className="grid gap-3 sm:grid-cols-2"
        >
          {previous && (
            <Link
              href={articleLink(previous)}
              className="glass-card-interactive rounded-xl p-5"
            >
              <span className="mb-2 block font-mono text-[10px] text-slate-400">
                ← Previous article
              </span>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {previous.title}
              </span>
            </Link>
          )}
          {next && (
            <Link
              href={articleLink(next)}
              className="glass-card-interactive rounded-xl p-5 sm:col-start-2"
            >
              <span className="mb-2 block font-mono text-[10px] text-slate-400">
                Next article →
              </span>
              <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      )}
      {related.length > 0 && (
        <section aria-labelledby="related-articles">
          <h2 id="related-articles" className="section-label mb-3">
            Related articles
          </h2>
          <ul className="space-y-3">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={articleLink(item)}
                  className="hover:text-theme-600 dark:hover:text-theme-400 text-sm text-slate-600 dark:text-slate-300"
                >
                  {item.title} →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <Link
        href={`/${locale}/blog`}
        className="hover:text-theme-600 dark:hover:text-theme-400 inline-block text-sm text-slate-500 dark:text-slate-400"
      >
        ← All articles
      </Link>
    </footer>
  );
}
