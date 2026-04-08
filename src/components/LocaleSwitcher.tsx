'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import clsx from 'clsx';

const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  'zh-TW': '繁',
  'zh-CN': '简',
};

const LOCALES = Object.keys(LOCALE_LABELS);

export default function LocaleSwitcher({ locale }: { locale: string }) {
  const pathname = usePathname();

  return (
    <div className="flex gap-1">
      {LOCALES.map((l) => {
        const targetPath = pathname.replace(`/${locale}`, `/${l}`);
        const isActive = l === locale;

        return (
          <Link
            key={l}
            href={targetPath}
            className={clsx(
              'rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
              isActive
                ? 'bg-theme-500/10 text-theme-600 dark:text-theme-400'
                : 'text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300'
            )}
          >
            {LOCALE_LABELS[l]}
          </Link>
        );
      })}
    </div>
  );
}
