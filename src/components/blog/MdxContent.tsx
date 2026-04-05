import { MDXRemote } from 'next-mdx-remote/rsc';
import { createHighlighter } from 'shiki';
import type { FC } from 'react';

const highlighter = await createHighlighter({
  themes: ['github-dark', 'github-light'],
  langs: [
    'typescript',
    'javascript',
    'tsx',
    'jsx',
    'bash',
    'json',
    'css',
    'html',
    'python',
    'yaml',
    'markdown',
  ],
});

function Code({
  children,
  className,
}: {
  children?: string;
  className?: string;
}) {
  const lang = className?.replace('language-', '') ?? 'text';
  const code = (children ?? '').trimEnd();

  const html = highlighter.codeToHtml(code, {
    lang,
    themes: { light: 'github-light', dark: 'github-dark' },
  });

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

const components = {
  pre: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  code: Code,
};

interface MdxContentProps {
  source: string;
}

const MdxContent: FC<MdxContentProps> = ({ source }) => (
  <article className="prose prose-slate max-w-none dark:prose-invert prose-headings:tracking-tight prose-a:text-theme-600 dark:prose-a:text-theme-400 prose-code:before:content-none prose-code:after:content-none">
    <MDXRemote
      source={source}
      components={components}
    />
  </article>
);

export default MdxContent;
