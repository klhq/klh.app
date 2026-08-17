import { mkdir, stat, writeFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { parse as parseJsonc, printParseErrorCode } from 'jsonc-parser';

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

const SUPPORTED_LOCALES = ['en', 'zh-TW', 'zh-CN'];

const RESUME_TOP_LEVEL_KEYS = new Set([
  'profile',
  'socialLinks',
  'skillSet',
  'workExperience',
  'education',
  'project',
]);

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
    throw new Error(`[fetch] GitHub API failed (${res.status}): ${bodyText}`);
  }

  const json = JSON.parse(bodyText) as GitHubContentsResponse;
  if (json.type !== 'file' || json.encoding !== 'base64' || !json.content) {
    throw new Error(`[fetch] Unexpected response for ${repo}/${filePath}`);
  }

  return Buffer.from(json.content, 'base64').toString('utf8');
}

async function fetchOptionalFile(
  repo: string,
  filePath: string,
  ref: string,
  token: string
): Promise<string | null> {
  try {
    return await fetchFile(repo, filePath, ref, token);
  } catch (err) {
    if (err instanceof Error && /GitHub API failed \(404\)/.test(err.message)) {
      return null;
    }
    throw err;
  }
}

function parseJsoncObject(
  content: string,
  label: string
): Record<string, unknown> {
  const errors: { error: number; offset: number; length: number }[] = [];
  const parsed = parseJsonc(content, errors, {
    allowTrailingComma: true,
    disallowComments: false,
  }) as unknown;
  if (errors.length > 0) {
    const summary = errors
      .map((e) => `${printParseErrorCode(e.error)} at offset ${e.offset}`)
      .join('; ');
    throw new Error(`[fetch] ${label} is not valid JSONC: ${summary}`);
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error(`[fetch] ${label} must be a JSON object.`);
  }
  return parsed as Record<string, unknown>;
}

function mergePatch(
  target: unknown,
  patch: unknown
): Record<string, unknown> | unknown {
  if (!patch || typeof patch !== 'object' || Array.isArray(patch)) {
    return patch;
  }

  const base: Record<string, unknown> =
    target && typeof target === 'object' && !Array.isArray(target)
      ? { ...(target as Record<string, unknown>) }
      : {};

  for (const [key, value] of Object.entries(patch as Record<string, unknown>)) {
    if (value === null) {
      delete base[key];
      continue;
    }

    if (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      typeof base[key] === 'object' &&
      base[key] !== null &&
      !Array.isArray(base[key])
    ) {
      base[key] = mergePatch(base[key], value) as Record<string, unknown>;
      continue;
    }

    base[key] = value;
  }

  return base;
}

function validateResumePatch(
  patch: Record<string, unknown>,
  variant: string,
  localeLabel: string
): void {
  delete patch['$schema'];

  const unknown = Object.keys(patch).filter(
    (key) => !RESUME_TOP_LEVEL_KEYS.has(key)
  );
  if (unknown.length > 0) {
    throw new Error(
      `[fetch] resume/variants/${variant}/${localeLabel}.patch.jsonc has unknown top-level keys: ${unknown.join(', ')}`
    );
  }
}

async function fetchResume(
  repo: string,
  ref: string,
  token: string,
  variant: string
): Promise<void> {
  const results = await Promise.allSettled(
    SUPPORTED_LOCALES.map(async (locale) => {
      const baseRemotePath = `resume/base/${locale}/data.jsonc`;
      const baseFallbackPath = 'resume/base/en/data.jsonc';
      const legacyRemotePath = `resume/${locale}/data.jsonc`;
      const legacyFallbackPath = 'resume/en/data.jsonc';
      const outDir = `src/content/resume/${locale}`;
      const outPath = path.join(outDir, 'data.jsonc');

      try {
        const localeBase = await fetchOptionalFile(
          repo,
          baseRemotePath,
          ref,
          token
        );
        const fallbackBase =
          localeBase === null
            ? await fetchOptionalFile(repo, baseFallbackPath, ref, token)
            : null;
        const legacyLocaleBase =
          localeBase === null && fallbackBase === null
            ? await fetchOptionalFile(repo, legacyRemotePath, ref, token)
            : null;
        const legacyFallbackBase =
          localeBase === null &&
          fallbackBase === null &&
          legacyLocaleBase === null
            ? await fetchOptionalFile(repo, legacyFallbackPath, ref, token)
            : null;

        const resolvedBase =
          localeBase ?? fallbackBase ?? legacyLocaleBase ?? legacyFallbackBase;

        if (!resolvedBase) {
          console.info(`[fetch] Resume (${locale}): base not found, skipping.`);
          return null;
        }

        let merged = parseJsoncObject(resolvedBase, `Resume base (${locale})`);

        if (variant !== 'default') {
          const patchRemotePath = `resume/variants/${variant}/${locale}.patch.jsonc`;
          const patchFallbackPath = `resume/variants/${variant}/en.patch.jsonc`;
          const localePatch = await fetchOptionalFile(
            repo,
            patchRemotePath,
            ref,
            token
          );
          const fallbackPatch =
            localePatch === null
              ? await fetchOptionalFile(repo, patchFallbackPath, ref, token)
              : null;
          const resolvedPatch = localePatch ?? fallbackPatch;

          if (resolvedPatch) {
            const patch = parseJsoncObject(
              resolvedPatch,
              `Resume patch (${variant}/${locale})`
            );
            validateResumePatch(patch, variant, localePatch ? locale : 'en');
            merged = mergePatch(merged, patch) as Record<string, unknown>;
          }
        }

        const withSchema = {
          ...merged,
          $schema: './data.schema.json',
        };
        const finalJsonc = JSON.stringify(withSchema, null, 2) + '\n';
        await mkdir(outDir, { recursive: true });
        await writeFile(outPath, finalJsonc, 'utf8');
        console.info(
          `[fetch] Resume (${locale}, variant=${variant}): ${outPath}`
        );
        return locale;
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(`[fetch] Resume (${locale}) failed: ${message}`);
      }
    })
  );

  const succeeded = results.filter(
    (r) => r.status === 'fulfilled' && r.value !== null
  );
  if (succeeded.length === 0) {
    const reasons = results
      .filter((r) => r.status === 'rejected')
      .map((r) => (r as PromiseRejectedResult).reason)
      .map((reason) =>
        reason instanceof Error ? reason.message : String(reason)
      );
    const detail = reasons.length > 0 ? `\n  - ${reasons.join('\n  - ')}` : '';
    throw new Error(
      `[fetch] No resume data found for any locale.${detail}`
    );
  }
}

async function fetchLanding(
  repo: string,
  ref: string,
  token: string
): Promise<void> {
  const outDir = 'src/content/landing';
  await mkdir(outDir, { recursive: true });

  const results = await Promise.allSettled(
    SUPPORTED_LOCALES.map(async (locale) => {
      const remotePath = `landing/${locale}.json`;
      const outPath = path.join(outDir, `${locale}.json`);

      const decoded = await fetchOptionalFile(repo, remotePath, ref, token);
      if (!decoded) {
        console.info(`[fetch] Landing (${locale}): not found, skipping.`);
        return null;
      }
      await writeFile(outPath, decoded, 'utf8');
      console.info(`[fetch] Landing (${locale}): ${outPath}`);
      return locale;
    })
  );

  const failed = results.filter((r) => r.status === 'rejected');
  if (failed.length > 0) {
    const reasons = failed
      .map((r) => (r as PromiseRejectedResult).reason)
      .map((reason) =>
        reason instanceof Error ? reason.message : String(reason)
      );
    throw new Error(
      `[fetch] Failed to fetch landing data:\n  - ${reasons.join('\n  - ')}`
    );
  }

  const succeeded = results.filter(
    (r) => r.status === 'fulfilled' && r.value !== null
  );
  if (succeeded.length === 0) {
    throw new Error('[fetch] No landing data found for any locale.');
  }
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
    if (refRes.status === 404) {
      console.info('[fetch] Blog: ref not found, skipping.');
      return;
    }
    const bodyText = await refRes.text();
    throw new Error(
      `[fetch] Blog ref resolution failed (${refRes.status}): ${bodyText}`
    );
  }
  const refJson = (await refRes.json()) as GitHubRefResponse;
  const commitSha = refJson.object.sha;

  // Get the full tree recursively
  const treeUrl = `https://api.github.com/repos/${repo}/git/trees/${commitSha}?recursive=1`;
  const treeRes = await fetch(treeUrl, { headers: GITHUB_HEADERS(token) });
  if (!treeRes.ok) {
    const bodyText = await treeRes.text();
    throw new Error(
      `[fetch] Blog tree fetch failed (${treeRes.status}): ${bodyText}`
    );
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

  console.info(`[fetch] Blog: ${succeeded.length} posts fetched to ${outDir}`);
  if (failed.length > 0) {
    console.warn(`[fetch] Blog: ${failed.length} posts failed to fetch`);
  }
}

async function fetchQuotes(
  repo: string,
  ref: string,
  token: string
): Promise<void> {
  const content = await fetchOptionalFile(repo, 'quotes.json', ref, token);
  if (!content) {
    console.info('[fetch] Quotes: not found, skipping.');
    return;
  }
  await mkdir('src/content', { recursive: true });
  await writeFile('src/content/quotes.json', content, 'utf8');
  console.info('[fetch] Quotes: src/content/quotes.json');
}

async function main(): Promise<void> {
  const repo = getEnv('CONTENT_REPO');
  const ref = getEnv('CONTENT_REF') ?? 'main';
  const token =
    getEnv('CONTENT_GITHUB_TOKEN') ??
    getEnv('GH_TOKEN') ??
    getEnv('GITHUB_TOKEN');
  const variant = getEnv('RESUME_VARIANT') ?? 'default';

  if (!repo) {
    const hasLocalResume = await fileExists('src/content/resume');
    const hasLocalLanding = await fileExists('src/content/landing');
    const hasLocalBlog = await fileExists('src/content/blog');
    if (hasLocalResume || hasLocalLanding || hasLocalBlog) {
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
    fetchResume(repo, ref, token, variant),
    fetchLanding(repo, ref, token),
    fetchBlogPosts(repo, ref, token),
    fetchQuotes(repo, ref, token),
  ]);
}

await main();
