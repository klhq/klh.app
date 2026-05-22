'use client';

import Link from 'next/link';
import clsx from 'clsx';
import {
  AiFillGithub,
  AiFillLinkedin,
} from 'react-icons/ai';
import { FaBluesky, FaTelegram, FaXTwitter } from 'react-icons/fa6';
import {
  HiOutlineDocumentText,
  HiOutlinePencilSquare,
  HiOutlineGlobeAlt,
} from 'react-icons/hi2';
import { IconType } from 'react-icons';
import { trackEvent } from '@/lib/analytics';

const ICON_MAP: Record<string, IconType> = {
  github: AiFillGithub,
  linkedin: AiFillLinkedin,
  bluesky: FaBluesky,
  telegram: FaTelegram,
  twitter: FaXTwitter,
  document: HiOutlineDocumentText,
  pencil: HiOutlinePencilSquare,
  globe: HiOutlineGlobeAlt,
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
  const Icon = ICON_MAP[icon] ?? HiOutlineGlobeAlt;

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
          muted ? 'h-4 w-4' : 'h-5 w-5',
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
          'hover-arrow',
          muted && 'text-slate-200 dark:text-slate-700'
        )}
      >
        →
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
