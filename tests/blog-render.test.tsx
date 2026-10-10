import { test } from 'node:test';
import assert from 'node:assert/strict';
import { renderToReadableStream } from 'react-dom/server';
import MdxContent from '../src/components/blog/MdxContent';

test('MDX keeps inline code inline and gives unknown fenced languages a readable fallback', async () => {
  const stream = await renderToReadableStream(
    await MdxContent({
      source: 'Use `hello()` here.\n\n```unlisted-language\nhello <world>\n```',
    })
  );
  const html = await new Response(stream).text();
  assert.match(html, /<p>Use <code[^>]*>hello\(\)<\/code> here\.<\/p>/);
  assert.match(html, /hello (?:&lt;|&#x3C;)world(?:&gt;|>)/);
  assert.match(html, /Copy code/);
});

test('headings with their own links retain valid separate anchor links', async () => {
  const stream = await renderToReadableStream(
    await MdxContent({ source: '## Read [the docs](https://example.com)' })
  );
  const html = await new Response(stream).text();
  assert.ok(!/<a[^>]*>[^<]*<a/.test(html));
  assert.ok(html.includes('aria-label="Link to Read the docs"'));
});

test('article tables render as tables and repeated leading titles appear once', async () => {
  const stream = await renderToReadableStream(
    await MdxContent({
      source: '# Example\n\n| Name | Value |\n| --- | --- |\n| Code | 42 |',
      title: 'Example',
    })
  );
  const html = await new Response(stream).text();
  assert.match(html, /<table>/);
  assert.match(html, /<td>42<\/td>/);
  assert.ok(!html.includes('<h1'));
});

test('relative article images use the static blog asset endpoint', async () => {
  const stream = await renderToReadableStream(
    await MdxContent({ source: '![Demo](./images/hero.gif)' })
  );
  const html = await new Response(stream).text();
  assert.ok(html.includes('src="/blog-assets/hero.gif"'));
  assert.ok(html.includes('alt="Demo"'));
});

test('article images expose an enlargement button while linked images remain links', async () => {
  const stream = await renderToReadableStream(
    await MdxContent({
      source:
        '![Screenshot](./images/hero.gif)\n\n[![Linked screenshot](./images/hero.gif)](https://example.com)',
    })
  );
  const html = await new Response(stream).text();
  assert.match(html, /aria-label="Enlarge image: Screenshot"/);
  assert.ok(!html.includes('aria-label="Enlarge image: Linked screenshot"'));
  assert.match(html, /<a href="https:\/\/example.com"><img/);
});

test('table of contents matches unique anchors including formatted and repeated headings', async () => {
  const stream = await renderToReadableStream(
    await MdxContent({
      source: '## Install `tools`\n\nBody\n\n## Install tools\n\n### 中文標題',
    })
  );
  const html = await new Response(stream).text();
  for (const id of ['install-tools', 'install-tools-1', '中文標題']) {
    assert.ok(html.includes(`id="${id}"`));
    assert.ok(html.includes(`href="#${id}"`));
  }
  assert.match(html, /aria-label="Table of contents"/);
});
