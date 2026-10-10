import path from 'node:path';
import { validateBlogDirectory } from './blog-validation';

try {
  const count = await validateBlogDirectory(
    path.resolve(process.argv[2] ?? 'src/content/blog')
  );
  console.info(`[blog] Validated ${count} articles (including drafts).`);
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
