export type GithubRequest = (
  input: Parameters<typeof fetch>[0],
  init?: Parameters<typeof fetch>[1]
) => ReturnType<typeof fetch>;

export async function fetchGithubBytes(
  repo: string,
  filePath: string,
  ref: string,
  token: string,
  request: GithubRequest = fetch
): Promise<Buffer> {
  const url = `https://api.github.com/repos/${repo}/contents/${encodeURIComponent(filePath)}?ref=${encodeURIComponent(ref)}`;
  const response = await request(url, {
    headers: {
      Accept: 'application/vnd.github.raw+json',
      Authorization: `Bearer ${token}`,
      'User-Agent': 'klh-app-build-fetch',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
  if (!response.ok)
    throw new Error(
      `[fetch] GitHub API failed (${response.status}): ${await response.text()}`
    );
  return Buffer.from(await response.arrayBuffer());
}
