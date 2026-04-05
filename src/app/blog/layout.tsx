import Link from 'next/link';
import clsx from 'clsx';

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <nav className="fixed top-4 right-4 z-50">
        <Link
          href="/resume"
          className={clsx(
            'rounded-full border border-slate-200 bg-white/50 px-4 py-2 text-sm font-medium text-slate-600 shadow-md backdrop-blur-sm transition-all duration-200',
            'hover:border-theme-600/50 hover:text-theme-600 hover:shadow-lg',
            'dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300',
            'dark:hover:border-theme-400/50 dark:hover:text-theme-400'
          )}
        >
          Resume
        </Link>
      </nav>
      {children}
    </div>
  );
}
