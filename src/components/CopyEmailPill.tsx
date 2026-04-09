'use client';

import { useState } from 'react';
import { AiOutlineMail, AiOutlineCheck } from 'react-icons/ai';
import { trackEvent } from '@/lib/analytics';
import clsx from 'clsx';

export default function CopyEmailPill({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const handleClick = async () => {
    await navigator.clipboard.writeText(email);
    trackEvent('email_copy');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleClick}
      className="glass-card-interactive group flex w-full cursor-pointer items-center gap-3 px-4 py-3 hover:scale-[1.01]"
    >
      {copied ? (
        <AiOutlineCheck className="h-5 w-5 text-emerald-500 transition-colors" />
      ) : (
        <AiOutlineMail
          className={clsx(
            'h-5 w-5 text-slate-400 transition-colors',
            'group-hover:text-theme-600',
            'dark:text-slate-500 dark:group-hover:text-theme-400'
          )}
        />
      )}
      <span
        className={clsx(
          'flex-1 text-left text-sm font-medium transition-colors',
          copied
            ? 'text-emerald-600 dark:text-emerald-400'
            : 'text-slate-700 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-slate-100'
        )}
      >
        {copied ? 'Copied!' : email}
      </span>
      <span className="hover-arrow">
        {copied ? '' : '⎘'}
      </span>
    </button>
  );
}
