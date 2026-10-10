import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { createHighlighter } from 'shiki';
import { isValidElement, type ReactElement, type ReactNode } from 'react';
import CodeBlock from './CodeBlock';
import { blogImageUrl } from '@/lib/blog-assets';

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
const loadedLanguages = new Set(highlighter.getLoadedLanguages());

function Pre({ children }: { children?: ReactNode }) {
  if (!isValidElement(children)) return <pre>{children}</pre>;
  const props = (
    children as ReactElement<{ children?: string; className?: string }>
  ).props;
  const code = (props.children ?? '').replace(/\n$/, '');
  const language = props.className?.replace('language-', '') ?? 'text';
  const lang = loadedLanguages.has(language)
    ? language
    : 'text';
  const html = highlighter.codeToHtml(code, {
    lang,
    themes: { light: 'github-light', dark: 'github-dark' },
  });
  return <CodeBlock code={code} language={language} html={html} />;
}

type TreeNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: TreeNode[];
};
type Heading = { id: string; title: string; level: number };

function nodeText(node: TreeNode): string {
  return node.value ?? node.children?.map(nodeText).join('') ?? '';
}

export default async function MdxContent({
  source,
  title: articleTitle,
}: {
  source: string;
  title?: string;
}) {
  const headings: Heading[] = [];
  const ids = new Set<string>();
  function headingLinks() {
    return (tree: TreeNode) => {
      const first = tree.children?.[0];
      if (first?.tagName === 'h1' && nodeText(first) === articleTitle)
        tree.children?.shift();
      function visit(node: TreeNode) {
        if (node.type === 'element' && /^h[1-6]$/.test(node.tagName ?? '')) {
          const title = nodeText(node);
          const base =
            title
              .toLowerCase()
              .replace(/[^\p{L}\p{N}\s_-]/gu, '')
              .trim()
              .replace(/\s+/g, '-') || 'section';
          let id = base;
          let index = 1;
          while (ids.has(id)) id = `${base}-${index++}`;
          ids.add(id);
          node.properties = { ...node.properties, id };
          const level = Number(node.tagName?.slice(1));
          if (level === 2 || level === 3) headings.push({ id, title, level });
          node.children = [
            ...(node.children ?? []),
            {
              type: 'element',
              tagName: 'a',
              properties: {
                href: `#${id}`,
                className: ['heading-link'],
                ariaLabel: `Link to ${title}`,
              },
              children: [{ type: 'text', value: ' #' }],
            },
          ];
          return;
        }
        node.children?.forEach(visit);
      }
      visit(tree);
    };
  }
  const { content } = await compileMDX({
    source,
    components: {
      pre: Pre,
      img: ({ src, alt, ...props }) => {
        // MDX supplies string image paths; keep external URLs intact.
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            {...props}
            src={typeof src === 'string' ? blogImageUrl(src) : src}
            alt={alt ?? ''}
            loading="lazy"
          />
        );
      },
    },
    options: {
      mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [headingLinks] },
    },
  });
  return (
    <>
      {headings.length > 0 && (
        <details className="mb-10 rounded-xl border border-slate-200 bg-white/50 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/50">
          <summary className="cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-300">
            On this page
          </summary>
          <nav aria-label="Table of contents" className="mt-4">
            <ul className="space-y-2 text-sm">
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  className={heading.level === 3 ? 'pl-4' : ''}
                >
                  <a
                    href={`#${heading.id}`}
                    className="hover:text-theme-600 dark:hover:text-theme-400 text-slate-500 dark:text-slate-400"
                  >
                    {heading.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </details>
      )}
      <article className="blog-prose prose prose-slate dark:prose-invert prose-headings:tracking-tight prose-a:text-theme-600 dark:prose-a:text-theme-400 prose-code:before:content-none prose-code:after:content-none max-w-none">
        {content}
      </article>
    </>
  );
}
