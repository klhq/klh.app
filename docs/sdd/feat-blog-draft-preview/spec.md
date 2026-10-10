## Goal

Read main-branch drafts on the existing private klh-preview.home deployment and catch content errors before merging a content PR.

## Acceptance Criteria

- Blog pages include drafts only when the existing isPreviewMode() returns true. Production listings and direct links continue excluding drafts.
- Preview draft cards and article pages show a Draft preview label. Draft metadata prohibits indexing. RSS and sitemap always exclude drafts.
- A shared validate:blog command checks every article, including drafts, using the existing frontmatter rules and MDX compiler. It names invalid article files and missing local image references and exits nonzero on failure.
- Validation compiles MDX without executing its JavaScript expressions or fetching external images.
- klh-content GitHub PR checks run the shared validator against checked-out PR content, without deployment credentials. The existing main-only Vercel and Forgejo deployment triggers stay unchanged.

## Scope

Blog preview visibility, draft labels, a shared offline validator, and the content repository PR workflow. Existing preview mode is a build setting, not an access-control mechanism; klh-preview.home retains its existing private network routing.

## Out of Scope

PR deployments, new domains or services, automatic publishing, access-control changes, and changing branch protection without inspecting the existing rules.

## Tasks

1. Allow explicit draft access in preview pages while keeping discovery published-only.
2. Add compile-only article and image validation with regression tests.
3. Wire the shared command into content PR checks and document the main-branch authoring flow.

## Authorization

The user approved main-branch draft preview and PR content checks with “好” after clarifying that preview rebuilding remains main-only.
