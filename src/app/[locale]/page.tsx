import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import {
  SUPPORTED_LOCALES,
  getDictionary,
  getResumeData,
  type Locale,
} from '@/lib/i18n';

interface LandingPageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: LandingPageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'KL Hsu',
    description: 'Software engineer building web & decentralized applications',
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `/${l}`])
      ),
    },
    openGraph: { locale },
  };
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { locale } = await params;
  const [dictionary, resumeData] = await Promise.all([
    getDictionary(locale as Locale),
    getResumeData(locale as Locale),
  ]);

  const { profile, socialLinks } = resumeData;
  const emailLink = socialLinks.find((l) => l.name === 'Email');
  const email = emailLink?.link ?? '';

  return (
    <div
      className={clsx(
        'flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16',
        'dark:bg-slate-950'
      )}
    >
      {/* Hero */}
      <section className="mb-16 text-center">
        {email && (
          <Image
            src={`https://www.gravatar.com/avatar/${await md5(email)}?s=160`}
            alt={profile.name}
            className="mx-auto mb-6 rounded-full shadow-lg"
            width={96}
            height={96}
            unoptimized
          />
        )}
        <h1
          className={clsx(
            'mb-3 text-4xl font-extrabold tracking-tighter text-slate-900',
            'dark:text-slate-50',
            'sm:text-5xl'
          )}
        >
          {dictionary.hero.greeting}
        </h1>
        <p className="mb-4 text-lg text-slate-500 dark:text-slate-400">
          {dictionary.hero.tagline}
        </p>
        {dictionary.hero.availability && (
          <span
            className={clsx(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium',
              'border-emerald-200 bg-emerald-50 text-emerald-700',
              'dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
            )}
          >
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {dictionary.hero.availability}
          </span>
        )}
      </section>

      {/* Navigation */}
      <nav className="mb-16 flex gap-4">
        <Link
          href={`/${locale}/resume`}
          className={clsx(
            'rounded-full border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all',
            'hover:border-theme-600/50 hover:text-theme-600 hover:shadow-md',
            'dark:border-slate-700 dark:text-slate-300',
            'dark:hover:border-theme-400/50 dark:hover:text-theme-400'
          )}
        >
          {dictionary.nav.resume}
        </Link>
        <Link
          href="/blog"
          className={clsx(
            'rounded-full border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-600 shadow-sm transition-all',
            'hover:border-theme-600/50 hover:text-theme-600 hover:shadow-md',
            'dark:border-slate-700 dark:text-slate-300',
            'dark:hover:border-theme-400/50 dark:hover:text-theme-400'
          )}
        >
          {dictionary.nav.blog}
        </Link>
      </nav>

      {/* Projects */}
      {dictionary.projects.items.length > 0 && (
        <section className="mb-16 w-full max-w-2xl">
          <h2
            className={clsx(
              'mb-6 text-center text-xl font-bold text-slate-900',
              'dark:text-slate-50'
            )}
          >
            {dictionary.projects.title}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {dictionary.projects.items.map((project) => (
              <a
                key={project.name}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(
                  'group rounded-xl border border-slate-200 p-5 transition-all',
                  'hover:border-theme-500/50 hover:shadow-md',
                  'dark:border-slate-800 dark:hover:border-theme-400/50'
                )}
              >
                <h3
                  className={clsx(
                    'mb-1 font-semibold text-slate-900 transition-colors',
                    'group-hover:text-theme-600',
                    'dark:text-slate-100 dark:group-hover:text-theme-400'
                  )}
                >
                  {project.name}
                </h3>
                <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
                  {project.description}
                </p>
                {project.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className={clsx(
                          'rounded-md border border-slate-200 px-2 py-0.5 font-mono text-xs text-slate-500',
                          'dark:border-white/10 dark:text-slate-400'
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Contact */}
      <section className="text-center">
        <h2
          className={clsx(
            'mb-3 text-xl font-bold text-slate-900',
            'dark:text-slate-50'
          )}
        >
          {dictionary.contact.title}
        </h2>
        <p className="mb-6 text-slate-500 dark:text-slate-400">
          {dictionary.contact.cta}
        </p>
        <div className="flex justify-center gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={
                link.name === 'Email' ? `mailto:${link.link}` : link.link
              }
              target={link.name === 'Email' ? undefined : '_blank'}
              rel={link.name === 'Email' ? undefined : 'noopener noreferrer'}
              className={clsx(
                'text-sm font-medium text-slate-500 transition-colors',
                'hover:text-theme-600',
                'dark:text-slate-400 dark:hover:text-theme-400'
              )}
            >
              {link.name}
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}

async function md5(input: string): Promise<string> {
  const { createHash } = await import('node:crypto');
  return createHash('md5').update(input.trim().toLowerCase()).digest('hex');
}
