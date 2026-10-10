export const BLOG_IMAGE_PATTERN =
  /^[a-zA-Z0-9][a-zA-Z0-9_.-]*\.(png|jpe?g|gif|webp|avif)$/;

export function blogImageUrl(source: string): string {
  const filename = source.replace(/^(?:\.\/)?images\//, '');
  return filename !== source && BLOG_IMAGE_PATTERN.test(filename)
    ? `/blog-assets/${encodeURIComponent(filename)}`
    : source;
}
