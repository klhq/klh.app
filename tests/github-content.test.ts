import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchGithubBytes, type GithubRequest } from '../scripts/github-content';

test('downloads large binary assets through the raw GitHub media type', async () => {
  const bytes = new Uint8Array(1_957_594).fill(255);
  bytes.set([71, 73, 70, 56, 57, 97]);
  const request: GithubRequest = async (_input, init) => {
    const headers = new Headers(init?.headers);
    return headers.get('Accept') === 'application/vnd.github.raw+json'
      ? new Response(bytes)
      : Response.json({ type: 'file', encoding: 'none', content: '' });
  };
  const downloaded = await fetchGithubBytes(
    'klhq/klh-content',
    'blog/images/hero.gif',
    'commit-sha',
    'test-token',
    request
  );
  assert.deepEqual(new Uint8Array(downloaded), bytes);
});
