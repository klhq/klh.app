## Review

I reviewed the blog publishing and reading changes against the approved first-wave scope. The Goose review covered compliance, security, correctness, performance, and tests. An additional security pass covered the image endpoint and synchronization changes and reported no findings.

The initial review identified date normalization as a concern. Quoted invalid dates already failed validation, but unquoted YAML dates could normalize before validation. The new YAML schema keeps dates as strings, and a regression test covers the unquoted case. I replaced wrapped heading anchors with separate links to preserve headings that contain their own links. I also cached the loaded language set. The original download-failure test already asserted rejection and preservation of cached articles.

During browser verification, I found repeated titles, raw Markdown tables, and missing relative images in the existing article. The spec now includes those reading defects. The renderer supports tables and omits a matching leading title. The synchronization script includes supported image files in the same content snapshot, and the static asset endpoint restricts filenames and MIME types.

## AC Status

| Criterion                        | Status | Evidence                                                                                                                                                                       |
| -------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Draft protection                 | Done   | Direct lookup returns null; page and metadata return 404; listings exclude drafts.                                                                                             |
| Frontmatter validation           | Done   | Invalid quoted and unquoted dates fail with the article slug and field.                                                                                                        |
| Complete content synchronization | Done   | Failed downloads and invalid articles preserve prior files; successful and empty snapshots remove old files.                                                                   |
| Reading layout and navigation    | Done   | Browser verification covered the wider column, collapsible TOC, and section navigation.                                                                                        |
| Tables and repeated titles       | Done   | Render tests and the article preview show tables and one article title.                                                                                                        |
| Relative article images          | Done   | Render tests cover URL mapping; HTTP responses match all three local image files byte for byte.                                                                                |
| Code rendering and copying       | Done   | Tests cover inline code and unknown languages; browser verification shows Copied! after clicking the button. Dark highlighting and horizontal scrolling were visually checked. |
| Canonical and sharing metadata   | Done   | Metadata tests and the zh-TW article response point to the English canonical URL and include author/date.                                                                      |
| RSS and sitemap                  | Done   | Feed tests cover escaping and draft exclusion; both XML routes parse and return 200.                                                                                           |

## Validation

The regression suite contains 15 passing tests. TypeScript, ESLint, and the production build with live private GitHub synchronization pass. A Vercel preview failure exposed the Contents API limit for base64 downloads above 1 MB. Downloads now request raw bytes, and a regression test covers a 1.96 MB binary asset. The full build fetched the actual remote articles and images successfully. Unit tests also exercise the synchronization failure path. Browser checks used Brave on the local development server.

The content repository remains the source for articles and images. Deployment is outside this change.
