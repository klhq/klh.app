## Review

The delegated Goose review could not connect to bifrost.home, so the compliance, security, correctness, performance, and test passes were completed locally. No unresolved blocking findings remain.

The review found that literal JSX img elements bypass the Markdown component map. A failing test exposed this gap, and the image rehype pass now maps them to the same enlargement component while preserving their attributes. Both Markdown and JSX images inside links remain regular linked images. The related-article heading uses a labelled section without a fixed heading ID to avoid colliding with author-generated article anchors.

Updated dates and project links reuse frontmatter validation. Project URLs accept HTTP(S), reject executable schemes and embedded credentials, and open with noopener/noreferrer. React escapes titles and labels. Series collection validation runs before swapping synchronized content, so conflicting parts preserve the previous snapshot. Production navigation applies draft filtering before calculating series counts, neighbors, and related articles.

Reading estimates and navigation use simple scans and sorting over the existing article metadata. Existing loading behavior and private preview boundaries are retained. The content repository's existing shared validation workflow automatically inherits these checks after this app PR merges.

## AC Status

| Criterion                         | Status | Evidence                                                                                                                                                                                                                                                                                                                      |
| --------------------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reading time and updated dates    | Done   | Regression tests cover date validity, update ordering, minimum reading time, mixed/CJK prose, and fenced code. Real article estimates appeared in the browser.                                                                                                                                                                |
| Article-footer navigation         | Done   | Tests cover chronological links, related ranking/cap/ties, draft filtering, and safe project URLs. Temporary fixture HTTP and browser checks showed the footer and project links.                                                                                                                                             |
| Image enlargement                 | Done   | Render tests cover Markdown/JSX images and linked-image exclusions. Browser checks verified mouse and keyboard opening, Escape, close button, backdrop, and focus restoration. Desktop dark-mode proportions were visually checked; mobile containment uses max viewport height/width but was not tested on a physical phone. |
| Series metadata and navigation    | Done   | Tests cover order, visibility/counts, title consistency, duplicate positions, and snapshot preservation. A temporary out-of-date-order series showed correct series order in the browser and production standalone output.                                                                                                    |
| Existing publishing and discovery | Done   | Existing regressions pass. Production HTTP showed a hidden draft absent from navigation, list, RSS, and sitemap, with direct access returning 404. updated appeared in article modifiedTime and sitemap lastModified.                                                                                                         |

## Validation

29 tests pass. TypeScript and ESLint pass. The full production build downloaded the actual private content repository, validated its articles and images, and completed Next.js generation. A separate production build with temporary public series parts and a draft verified the standalone deployment output and discovery metadata over HTTP. The private development preview included the draft in its series directory and related navigation. Temporary articles were removed and never committed; the final build contains the real content only.

No content articles were edited in klh-content, no services were deployed, and no preview or production access controls were changed.
