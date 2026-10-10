# klh.app

Personal site with a landing page hub, blog, and resume. Built with Next.js, Tailwind CSS, and MDX.

**Live:** [klh.app](https://klh.app)

## Architecture

```
klh.app (this repo)          klh-content (private)        Gravatar API
├── Landing page hub    ←─── landing/{locale}.json        ← identity, avatar,
├── Blog (MDX)          ←─── blog/*.mdx                    social links
└── Resume (i18n)       ←─── resume/base/{locale}/data.jsonc + resume/variants/{variant}/{locale}.patch.jsonc
```

Content is fetched from a private GitHub repo at build time. Identity data (name, avatar, job title, location, social links) comes from the [Gravatar REST API](https://docs.gravatar.com/rest-api/) — update your Gravatar profile and the site reflects it within an hour.

## Stack

- **Framework:** Next.js 16 (App Router, SSG)
- **Runtime:** Bun
- **Styling:** Tailwind CSS v4, `@tailwindcss/typography`
- **Theme:** [`@klh-app/use-theme`](https://www.npmjs.com/package/@klh-app/use-theme) (system/light/dark)
- **Blog:** MDX via `next-mdx-remote`, syntax highlighting with Shiki
- **i18n:** `en`, `zh-TW`, `zh-CN` via `next-intl` (routing + locale detection)
- **Deployment:** Vercel (static), Cloudflare DNS
- **Analytics:** Self-hosted [Umami](https://umami.is) (tracker proxied same-origin via `/stats/*` rewrites)

## Routes

| Route                   | Description                        |
| ----------------------- | ---------------------------------- |
| `/`                     | Redirects to `/{locale}` via proxy |
| `/{locale}`             | Landing page hub                   |
| `/{locale}/resume`      | Resume                             |
| `/{locale}/blog`        | Blog list                          |
| `/{locale}/blog/{slug}` | Blog post                          |

Supported locales: `en`, `zh-TW`, `zh-CN`. Locale detection via `Accept-Language` header.

## Getting Started

```bash
# Install dependencies
bun install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your CONTENT_REPO and CONTENT_GITHUB_TOKEN

# Fetch content and start dev server
bun run dev

# Or use local content (skip fetch)
bun run dev:local
```

## Scripts

| Script                  | Description                                         |
| ----------------------- | --------------------------------------------------- |
| `bun run dev`           | Fetch content + start dev server                    |
| `bun run dev:local`     | Start dev server with existing local content        |
| `bun run build`         | Fetch content + production build                    |
| `bun run fetch:content` | Fetch resume, landing, and blog content from GitHub |
| `bun run lint`          | ESLint                                              |
| `bun test`              | Blog publishing and rendering regression tests      |
| `bun run prettier`      | Prettier                                            |

## Environment Variables

See [`.env.example`](.env.example) for all options. Required for content fetching:

| Variable               | Description                                   |
| ---------------------- | --------------------------------------------- |
| `CONTENT_REPO`         | GitHub repo (`owner/repo`) containing content |
| `CONTENT_GITHUB_TOKEN` | GitHub PAT with `contents:read` scope         |
| `RESUME_VARIANT`       | Resume variant id (`default`, `canva`, etc.)  |

Optional:

| Variable                   | Description                                       |
| -------------------------- | ------------------------------------------------- |
| `GRAVATAR_HASH`            | SHA256 hash of Gravatar email                     |
| `GRAVATAR_API_TOKEN`       | Gravatar API token (enables interests)            |
| `PRINT_EMAIL`              | Email override for resume PDF export              |
| `NEXT_PUBLIC_THEME_PRESET` | Theme preset (`default`, `meta`, `spotify`, etc.) |
| `NEXT_PUBLIC_UMAMI_ID`     | Umami website ID — enables the analytics tracker  |

## Content Structure (klh-content)

```
klh-content/
  landing/
    en.json              # Landing page strings per locale
    zh-TW.json
    zh-CN.json
  resume/
    base/
      en/data.jsonc      # Canonical resume data per locale
    variants/
      canva/en.patch.jsonc  # JSON Merge Patch overlay
    data.schema.json     # Shared schema
  quotes.json            # Footer easter egg quotes
  blog/
    hello-world.mdx      # Blog posts
```

Push to `klh-content` triggers a Vercel deploy hook.

## Blog Publishing

Write articles as `blog/<slug>.mdx`. Use letters, numbers, hyphens, and underscores for the slug. Frontmatter requires `title`, `description`, and a valid `date` in `YYYY-MM-DD` format. You can add `tags` as a string array, `image` as a sharing image URL, and `draft: true` to hide an article from direct links, listings, RSS, and sitemap.

Store article images in `blog/images/` and reference them with `./images/<filename>`. The fetch script downloads PNG, JPEG, GIF, WebP, and AVIF files with the articles. It validates the full batch before replacing the local blog snapshot. Failed downloads preserve the previous snapshot and fail strict builds.

Readers can expand the article table of contents, link to individual headings, and copy fenced code blocks. The renderer supports Markdown tables and keeps inline code within the paragraph. If the body starts with the same title as the article header, the renderer omits that repeated heading.

Subscribe at `/feed.xml`. The sitemap at `/sitemap.xml` lists published English article URLs. Locale routes share the English canonical URL because article content remains English.

## Design Language

"Glass Hub" — narrow `max-w-md` layout, glass cards (`backdrop-blur`, semi-transparent borders), monospace micro-labels, entrance animations. Shared across landing page and blog.

## License

MIT
