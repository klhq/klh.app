import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToReadableStream } from 'react-dom/server';
import MdxContent from '../src/components/blog/MdxContent';

test('MDX keeps inline code inline and gives unknown fenced languages a readable fallback', async () => {
  const stream = await renderToReadableStream(await MdxContent({ source: 'Use `hello()` here.\n\n```unlisted-language\nhello <world>\n```' }));
  const html = await new Response(stream).text();
  assert.match(html, /<p>Use <code[^>]*>hello\(\)<\/code> here\.<\/p>/);
  assert.match(html, /hello (?:&lt;|&#x3C;)world(?:&gt;|>)/);
  assert.match(html, /Copy code/);
});

test('table of contents matches unique anchors including formatted and repeated headings', async () => {
  const stream = await renderToReadableStream(await MdxContent({ source: '## Install `tools`\n\nBody\n\n## Install tools\n\n### 中文標題' }));
  const html = await new Response(stream).text();
  for (const id of ['install-tools', 'install-tools-1', '中文標題']) {
    assert.ok(html.includes(`id="${id}"`));
    assert.ok(html.includes(`href="#${id}"`));
  }
  assert.match(html, /aria-label="Table of contents"/);
});
