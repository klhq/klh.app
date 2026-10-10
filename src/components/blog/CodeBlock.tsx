'use client';

import { useEffect, useRef, useState } from 'react';

export default function CodeBlock({
  code,
  language,
  html,
}: {
  code: string;
  language: string;
  html: string;
}) {
  const [status, setStatus] = useState('Copy code');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus('Copied!');
    } catch {
      setStatus('Copy failed');
    }
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('Copy code'), 2000);
  }
  return (
    <div className="code-block not-prose my-6 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between gap-4 bg-slate-100 px-4 py-2 font-mono text-xs dark:bg-slate-900">
        <span className="truncate text-slate-500 dark:text-slate-400">
          {language}
        </span>
        <button
          type="button"
          onClick={copy}
          className="focus-visible:outline-theme-500 shrink-0 rounded px-2 py-1 text-slate-600 hover:bg-slate-200 focus-visible:outline-2 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <span aria-live="polite">{status}</span>
        </button>
      </div>
      <div
        className="code-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
