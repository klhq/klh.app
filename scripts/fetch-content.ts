import { mkdir, stat, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';

type GitHubContentsResponse = {
  type: string;
  encoding?: string;
  content?: string;
  path?: string;
  sha?: string;
  message?: string;
};

type GitHubTreeItem = {
  path: string;
  type: 'blob' | 'tree';
  sha: string;
};

type GitHubTreeResponse = {
  tree: GitHubTreeItem[];
  truncated: boolean;
};

type GitHubRefResponse = {
  object: { sha: string };
};

function getEnv(name: string): string | undefined {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

function coerceSchemaPath(jsonc: string): string {
  return jsonc.replace(/("\$schema"\s*:\s*)"[^"]*"/, '$1"./data.schema.json"');
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch (err) {
    if (err instanceof Error && 'code' in err && err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
}

const GITHUB_HEADERS = (token: string) => ({
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${token}`,
  'User-Agent': 'klh-app-build-fetch',
  'X-GitHub-Api-Version': '2022-11-28',
});

async function fetchFile(
  repo: string,
  filePath: string,
  ref: string,
  token: string
): Promise<string> {
  const url = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(filePath)}?ref=${encodeURIComponent(ref)}`;
  const res = await fetch(url, { headers: GITHUB_HEADERS(token) });
  const bodyText = await res.text();

  if (!res.ok) {
    throw new Error(
      `[fetch] GitHub API failed (${res.status}): ${bodyText}`
    );
  }

  const json = JSON.parse(bodyText) as GitHubContentsResponse;
  if (json.type !== 'file' || json.encoding !== 'base64' || !json.content) {
    throw new Error(`[fetch] Unexpected response for ${repo}/${filePath}`);
  }

  return Buffer.from(json.content, 'base64').toString('utf8');
}

async function fetchResume(
  repo: string,
  ref: string,
  token: string
): Promise<void> {
  const filePath = getEnv('CONTENT_RESUME_PATH') ?? 'resume/data.jsonc';
  const outPath = 'src/data.jsonc';

  const decoded = await fetchFile(repo, filePath, ref, token);
  const finalJsonc = coerceSchemaPath(decoded);

  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, finalJsonc, 'utf8');

  console.info(`[fetch] Resume: ${outPath} from ${repo}/${filePath} @ ${ref}`);
}

async function fetchBlogPosts(
  repo: string,
  ref: string,
  token: string
): Promise<void> {
  const outDir = 'src/content/blog';

  // Get the tree SHA for the ref
  const refUrl = `https://api.github.com/repos/${repo}/git/ref/heads/${encodeURIComponent(ref)}`;
  const refRes = await fetch(refUrl, { headers: GITHUB_HEADERS(token) });
  if (!refRes.ok) {
    console.info('[fetch] Blog: could not resolve ref, skipping.');
    return;
  }
  const refJson = (await refRes.json()) as GitHubRefResponse;
  const commitSha = refJson.object.sha;

  // Get the full tree recursively
  const treeUrl = `https://api.github.com/repos/${repo}/git/trees/${commitSha}?recursive=1`;
  const treeRes = await fetch(treeUrl, { headers: GITHUB_HEADERS(token) });
  if (!treeRes.ok) {
    console.info('[fetch] Blog: could not fetch tree, skipping.');
    return;
  }
  const treeJson = (await treeRes.json()) as GitHubTreeResponse;

  // Filter for blog/*.mdx files
  const blogFiles = treeJson.tree.filter(
    (item) =>
      item.type === 'blob' &&
      item.path.startsWith('blog/') &&
      item.path.endsWith('.mdx')
  );

  if (blogFiles.length === 0) {
    console.info('[fetch] Blog: no .mdx files found in blog/, skipping.');
    return;
  }

  // Clean and recreate output directory
  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  // Fetch each MDX file
  const results = await Promise.allSettled(
    blogFiles.map(async (file) => {
      const content = await fetchFile(repo, file.path, ref, token);
      const filename = path.basename(file.path);
      await writeFile(path.join(outDir, filename), content, 'utf8');
      return filename;
    })
  );

  const succeeded = results.filter((r) => r.status === 'fulfilled');
  const failed = results.filter((r) => r.status === 'rejected');

  console.info(
    `[fetch] Blog: ${succeeded.length} posts fetched to ${outDir}`
  );
  if (failed.length > 0) {
    console.warn(`[fetch] Blog: ${failed.length} posts failed to fetch`);
  }
}

async function main(): Promise<void> {
  const repo = getEnv('CONTENT_REPO');
  const ref = getEnv('CONTENT_REF') ?? 'main';
  const token = getEnv('CONTENT_GITHUB_TOKEN');

  if (!repo) {
    const hasLocalResume = await fileExists('src/data.jsonc');
    const hasLocalBlog = await fileExists('src/content/blog');
    if (hasLocalResume || hasLocalBlog) {
      console.info('[fetch] CONTENT_REPO not set; using local content.');
      return;
    }

    throw new Error(
      '[fetch] CONTENT_REPO not set and no local content found.\n' +
        'Set CONTENT_REPO/CONTENT_GITHUB_TOKEN and run `bun run fetch:content`.'
    );
  }

  if (!token) {
    throw new Error(
      '[fetch] Missing CONTENT_GITHUB_TOKEN. Required for private repos.'
    );
  }

  await Promise.all([
    fetchResume(repo, ref, token),
    fetchBlogPosts(repo, ref, token),
  ]);
}

await main();
