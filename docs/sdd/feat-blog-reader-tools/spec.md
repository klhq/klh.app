## Goal

Help readers assess, inspect, and continue reading technical articles with navigation, reading estimates, image enlargement, and series.

## Acceptance Criteria

- Article cards and headers display an automatically calculated reading estimate. Headers and cards display optional updated dates, validated as YYYY-MM-DD and not earlier than date. Date display uses UTC to preserve calendar dates.
- Article footers include a blog-list link, chronological previous/next articles, up to three related articles ranked by shared tags, and optional HTTP(S) GitHub/demo links from links.github and links.demo. The current article is excluded, with deterministic ties. Production never exposes drafts through these links.
- Clicking or keyboard-activating an article image opens an enlarged modal with its alt text. Close button, Escape, and backdrop close it, restoring focus to the trigger. Light/dark styling and mobile containment preserve image proportions. Images already wrapped in links keep their original link behavior.
- Optional series frontmatter has id, title, and positive integer order. Article pages display an ordered series directory, current article position, and series previous/next links. Counts and links use only visible articles. Duplicate orders or inconsistent titles for one series fail content validation. Single-part series still shows its directory; missing series hides the section.
- Existing draft preview, RSS, sitemap, code rendering, and remote content synchronization remain functional. updated populates sharing modifiedTime and sitemap lastModified when present.

## Scope

The first four feature ideas approved by the user: article-footer navigation, reading time and updated dates, image enlargement, and series. Metadata extensions are optional so existing articles work without edits. Keep locale routes and Glass Hub styling.

## Out of Scope

Search, new article-type layouts, comments, content translation, automatic content edits, and deployment changes.

## Tasks

1. Add validated reading metadata and display it in cards and headers.
2. Add footer navigation and validated project links.
3. Add series contracts, collection validation, and navigation.
4. Add accessible image enlargement and browser verification.

## Authorization

The user approved these four features with “前四個可以搞起來”. Implementation choices above fill in the existing proposal without adding a new product flow.
