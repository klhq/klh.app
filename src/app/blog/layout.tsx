import { cookies } from 'next/headers';
import Link from 'next/link';
import clsx from 'clsx';
import SettingsMenu from '@/components/SettingsMenu';

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value ?? 'en';

  return (
    <div className="relative">
      <nav className="fixed top-4 left-4 z-50">
        <Link
          href={`/${locale}`}
          className={clsx(
            'group flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white/50 text-slate-600 shadow-md backdrop-blur-sm transition-all duration-200',
            'hover:border-theme-600/50 hover:text-theme-600 hover:shadow-lg',
            'dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300',
            'dark:hover:border-theme-400/50 dark:hover:text-theme-400'
          )}
          title="Back to home"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-0.5">←</span>
        </Link>
      </nav>
      <SettingsMenu />
      {children}
    </div>
  );
}
