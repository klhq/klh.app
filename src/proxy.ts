import { NextRequest, NextResponse } from 'next/server';

const SUPPORTED_LOCALES = ['en', 'zh-TW', 'zh-CN'];
const DEFAULT_LOCALE = 'en';

function getPreferredLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return DEFAULT_LOCALE;

  const preferred = acceptLanguage
    .split(',')
    .map((part) => {
      const [lang, q] = part.trim().split(';q=');
      return { lang: lang.trim(), q: q ? parseFloat(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of preferred) {
    // Exact match
    if (SUPPORTED_LOCALES.includes(lang)) return lang;
    // Language-only match (e.g. "zh" → "zh-TW")
    const base = lang.split('-')[0];
    const match = SUPPORTED_LOCALES.find((l) => l.startsWith(base));
    if (match) return match;
  }

  return DEFAULT_LOCALE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path already starts with a supported locale
  const pathnameLocale = SUPPORTED_LOCALES.find(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (pathnameLocale) {
    // Set locale cookie and continue
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', pathnameLocale, { path: '/' });
    return response;
  }

  // Detect locale for paths that need redirection
  const locale =
    request.cookies.get('NEXT_LOCALE')?.value ?? getPreferredLocale(request);

  // Redirect bare paths to locale-prefixed versions
  // e.g. / → /en, /resume → /en/resume
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

  const response = NextResponse.redirect(url);
  response.cookies.set('NEXT_LOCALE', locale, { path: '/' });
  return response;
}

export const config = {
  matcher: ['/((?!_next|api|blog|favicon|icon|.*\\..*).*)'],
};
