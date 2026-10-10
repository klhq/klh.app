## Goal

Give readers a comfortable technical blog and give the author a reliable publishing path.

## Acceptance Criteria

- Draft articles return 404 through direct links and never appear in metadata, RSS, or sitemap.
- Invalid frontmatter produces a useful error naming the article and field.
- A failed blog download preserves the previous local articles and fails strict builds. Successful synchronization removes deleted articles, including an empty remote blog.
- Articles use a wider reading column, readable typography, linked headings, and a collapsible table of contents generated from rendered headings.
- Markdown tables render as tables. A leading body heading that repeats the article title appears only once.
- Relative `./images/` article images load from the same validated content snapshot as the MDX files.
- Inline code stays inline. Fenced code supports copy, light/dark highlighting, and plain-text fallback for unknown languages.
- English article content uses the English URL as canonical across locale routes. Sharing metadata includes article date and author.
- Readers can discover the RSS feed from the blog and metadata. RSS and sitemap include published articles only.

## Scope

Blog loading, synchronization, article rendering, and discovery metadata. Keep locale routes and Glass Hub styling.

## Out of Scope

Search, series, comments, related articles, content translation, and production deployment.

## Tasks

1. Protect drafts and validate frontmatter.
2. Stage complete blog downloads before replacing local content.
3. Improve reading layout and MDX rendering.
4. Add canonical metadata, RSS, and sitemap.

## Authorization

The user approved the first-wave proposal in this conversation with “好！”.
