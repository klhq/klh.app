'use client';

import { ComponentType } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import {
  FileText,
  SquarePen,
  Globe,
  ArrowRight,
} from 'lucide-react';
import {
  BlueskyIcon,
  TelegramIcon,
  XTwitterIcon,
  GithubIcon,
  LinkedinIcon,
} from '@/components/icons';
import { trackEvent } from '@/lib/analytics';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- union of LucideIcon + custom SVG components
type AnyIcon = ComponentType<any>;

const ICON_MAP: Record<string, AnyIcon> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  bluesky: BlueskyIcon,
  telegram: TelegramIcon,
  twitter: XTwitterIcon,
  document: FileText,
  pencil: SquarePen,
  globe: Globe,
};

export default function LinkPill({
  href,
  icon,
  label,
  external,
  muted,
}: {
  href: string;
  icon: string;
  label: string;
  external?: boolean;
  muted?: boolean;
}) {
  const Icon = ICON_MAP[icon] ?? Globe;

  const classes = clsx(
    'group flex items-center gap-3 px-4',
    muted ? 'py-2' : 'py-3',
    muted
      ? [
          'rounded-xl border border-slate-200/30 bg-white/30 transition-all',
          'hover:border-slate-200/60 hover:bg-white/50',
          'dark:border-white/3 dark:bg-slate-900/20',
          'dark:hover:border-white/5 dark:hover:bg-slate-900/40',
        ]
      : 'glass-card-interactive hover:scale-[1.01]'
  );

  const handleClick = () => {
    trackEvent('outbound_click', { source: 'pill', label, url: href });
  };

  const content = (
    <>
      <Icon
        className={clsx(
          'transition-colors',
          muted ? 'size-4' : 'size-5',
          muted
            ? 'text-slate-300 group-hover:text-slate-400 dark:text-slate-600 dark:group-hover:text-slate-500'
            : 'text-slate-400 group-hover:text-theme-600 dark:text-slate-500 dark:group-hover:text-theme-400'
        )}
      />
      <span
        className={clsx(
          'flex-1 font-medium transition-colors',
          muted ? 'text-xs' : 'text-sm',
          muted
            ? 'text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-400'
            : 'text-slate-700 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-slate-100'
        )}
      >
        {label}
      </span>
      <span
        className={clsx(
          'hover-arrow inline-flex items-center',
          muted && 'text-slate-200 dark:text-slate-700'
        )}
      >
        <ArrowRight className="size-4" />
      </span>
    </>
  );

  if (external || href.startsWith('mailto:')) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={classes}
        onClick={handleClick}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} onClick={handleClick}>
      {content}
    </Link>
  );
}
