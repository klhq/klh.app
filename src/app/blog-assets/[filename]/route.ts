import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { BLOG_IMAGE_PATTERN } from '@/lib/blog-assets';

const directory = path.join(process.cwd(), 'src/content/blog/images');
const contentTypes: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  avif: 'image/avif',
};
export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  try {
    return (await readdir(directory))
      .filter((filename) => BLOG_IMAGE_PATTERN.test(filename))
      .map((filename) => ({ filename }));
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT')
      return [];
    throw error;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  if (!BLOG_IMAGE_PATTERN.test(filename))
    return new Response(null, { status: 404 });
  try {
    const bytes = await readFile(path.join(directory, filename));
    return new Response(new Uint8Array(bytes), {
      headers: {
        'Content-Type': contentTypes[filename.split('.').pop()!],
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT')
      return new Response(null, { status: 404 });
    throw error;
  }
}
