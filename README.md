# klh.app

Personal site with a landing page hub, blog, and resume. Built with Next.js, Tailwind CSS, and MDX.

**Live:** [klh.app](https://klh.app)

## Architecture

```
klh.app (this repo)          klh-content (private)        Gravatar API
├── Landing page hub    ←─── landing/{locale}.json        ← identity, avatar,
├── Blog (MDX)          ←─── blog/*.mdx                    social links
└── Resume (i18n)       ←─── resume/{locale}/data.jsonc
```

Content is fetched from a private GitHub repo at build time. Identity data (name, avatar, job title, location, social links) comes from the [Gravatar REST API](https://docs.gravatar.com/rest-api/) — update your Gravatar profile and the site reflects it within an hour.

## Stack

- **Framework:** Next.js 16 (App Router, SSG)
- **Runtime:** Bun
- **Styling:** Tailwind CSS v4, `@tailwindcss/typography`
- **Theme:** [`@klh-app/theme`](https://www.npmjs.com/package/@klh-app/theme) (system/light/dark)
- **Blog:** MDX via `next-mdx-remote`, syntax highlighting with Shiki
- **i18n:** `en`, `zh-TW`, `zh-CN` (landing + resume only, no library)
- **Deployment:** Vercel (static), Cloudflare DNS
- **Analytics:** Google Analytics via `@next/third-parties`

## Routes

| Route | Description |
|---|---|
| `/` | Redirects to `/{locale}` via proxy |
| `/{locale}` | Landing page hub |
| `/{locale}/resume` | Resume |
| `/blog` | Blog list (English only) |
| `/blog/{slug}` | Blog post |

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

| Script | Description |
|---|---|
| `bun run dev` | Fetch content + start dev server |
| `bun run dev:local` | Start dev server with existing local content |
| `bun run build` | Fetch content + production build |
| `bun run fetch:content` | Fetch resume, landing, and blog content from GitHub |
| `bun run lint` | ESLint |
| `bun run prettier` | Prettier |

## Environment Variables

See [`.env.example`](.env.example) for all options. Required for content fetching:

| Variable | Description |
|---|---|
| `CONTENT_REPO` | GitHub repo (`owner/repo`) containing content |
| `CONTENT_GITHUB_TOKEN` | GitHub PAT with `contents:read` scope |

Optional:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID |
| `PRINT_EMAIL` | Email override for resume PDF export |
| `NEXT_PUBLIC_THEME_PRESET` | Theme preset (`default`, `meta`, `spotify`, etc.) |

## Content Structure (klh-content)

```
klh-content/
  landing/
    en.json              # Landing page strings per locale
    zh-TW.json
    zh-CN.json
  resume/
    en/data.jsonc        # Resume data per locale
    data.schema.json     # Shared schema
  blog/
    hello-world.mdx      # Blog posts (English only)
```

Push to `klh-content` triggers a Vercel deploy hook.

## Design Language

"Glass Hub" — narrow `max-w-md` layout, glass cards (`backdrop-blur`, semi-transparent borders), monospace micro-labels, entrance animations. Shared across landing page and blog.

## License

MIT
