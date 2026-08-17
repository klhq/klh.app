/**
 * Preview mode detection.
 *
 * Preview mode enables experimental features (locale switching, color preset
 * switcher) that are not exposed in the production build.
 *
 * Detection priority:
 *   1. NEXT_PUBLIC_PREVIEW=true  (set in the container / .env)
 *   2. NODE_ENV=development       (local `next dev`)
 */
export function isPreviewMode(): boolean {
  // Explicit env flag — the single source of truth for deployed previews
  if (process.env.NEXT_PUBLIC_PREVIEW === 'true') {
    return true;
  }

  // Local dev server
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  return false;
}
