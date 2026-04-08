import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import clsx from 'clsx';
import { AiFillGithub, AiFillLinkedin, AiOutlineMail } from 'react-icons/ai';
import { HiOutlineDocumentText, HiOutlinePencilSquare } from 'react-icons/hi2';
import { IconType } from 'react-icons';
import {
  SUPPORTED_LOCALES,
  getDictionary,
  getResumeData,
  type Locale,
} from '@/lib/i18n';
import { getAllPosts } from '@/lib/blog';

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

const SOCIAL_ICONS: Record<string, IconType> = {
  GitHub: AiFillGithub,
  LinkedIn: AiFillLinkedin,
  Email: AiOutlineMail,
};

export default async function LandingPage({ params }: LandingPageProps) {
  const { locale } = await params;
  const [dictionary, resumeData, posts] = await Promise.all([
    getDictionary(locale as Locale),
    getResumeData(locale as Locale),
    getAllPosts(),
  ]);

  const { profile, socialLinks } = resumeData;
  const emailLink = socialLinks.find((l) => l.name === 'Email');
  const email = emailLink?.link ?? '';
  const gravatar = await fetchGravatarProfile();
  const recentPosts = posts.slice(0, 4);

  return (
    <div
      className={clsx(
        'relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12',
        'dark:bg-slate-950'
      )}
    >
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="bg-theme-500/8 absolute -top-32 -left-32 h-80 w-80 rounded-full blur-[100px]" />
        <div className="bg-theme-400/6 absolute -right-24 top-1/3 h-64 w-64 rounded-full blur-[120px]" />
        <div className="bg-theme-600/5 absolute -bottom-32 left-1/3 h-80 w-80 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md">
        {/* Identity */}
        <section className="animate-fade-in-down mb-8 text-center">
          {gravatar?.avatar_url && (
            <Image
              src={`${gravatar.avatar_url}?s=200`}
              alt={gravatar.avatar_alt_text || profile.name}
              className={clsx(
                'mx-auto mb-5 rounded-full ring-2 ring-white/80 shadow-lg',
                'dark:ring-slate-800'
              )}
              width={88}
              height={88}
              priority
              unoptimized
            />
          )}
          <h1
            className={clsx(
              'mb-2 text-2xl font-bold tracking-tight text-slate-900',
              'dark:text-slate-50'
            )}
          >
            {profile.name}
          </h1>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
            {dictionary.hero.tagline}
          </p>

          {dictionary.hero.availability && (
            <span
              className={clsx(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium',
                'border-emerald-200/60 bg-emerald-50/80 text-emerald-700',
                'dark:border-emerald-800/40 dark:bg-emerald-950/50 dark:text-emerald-400'
              )}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              {dictionary.hero.availability}
            </span>
          )}
        </section>

        {/* Link Pills */}
        <section className="animate-fade-in-up mb-8 flex flex-col gap-2.5">
          <LinkPill
            href="/blog"
            icon={HiOutlinePencilSquare}
            label={dictionary.nav.blog}
          />
          {socialLinks.map((link) => {
            const Icon = SOCIAL_ICONS[link.name];
            if (!Icon) return null;
            return (
              <LinkPill
                key={link.name}
                href={
                  link.name === 'Email' ? `mailto:${link.link}` : link.link
                }
                icon={Icon}
                label={link.name === 'Email' ? link.link : link.name}
                external={link.name !== 'Email'}
              />
            );
          })}
          <LinkPill
            href={`/${locale}/resume`}
            icon={HiOutlineDocumentText}
            label={dictionary.nav.resume}
            muted
          />
        </section>

        {/* Blog Carousel */}
        {recentPosts.length > 0 && (
          <section className="animate-fade-in-up mb-8">
            <div className="mb-3 flex items-center justify-between px-1">
              <h2
                className={clsx(
                  'text-xs font-semibold tracking-wider text-slate-400 uppercase',
                  'dark:text-slate-500'
                )}
              >
                {dictionary.nav.blog}
              </h2>
              <Link
                href="/blog"
                className="text-xs text-slate-400 transition-colors hover:text-theme-600 dark:text-slate-500 dark:hover:text-theme-400"
              >
                →
              </Link>
            </div>
            <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-none">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={clsx(
                    'group flex-none snap-start rounded-xl border p-4 transition-all',
                    'w-[260px]',
                    'border-slate-200/60 bg-white/60 backdrop-blur-sm',
                    'hover:border-theme-500/40 hover:shadow-md',
                    'dark:border-white/5 dark:bg-slate-900/40',
                    'dark:hover:border-theme-400/30'
                  )}
                >
                  <div className="mb-2 font-mono text-[10px] text-slate-400 dark:text-slate-500">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </div>
                  <h3
                    className={clsx(
                      'mb-1 text-sm font-semibold text-slate-900 transition-colors',
                      'group-hover:text-theme-600',
                      'dark:text-slate-100 dark:group-hover:text-theme-400'
                    )}
                  >
                    {post.title}
                  </h3>
                  <p className="line-clamp-2 text-xs text-slate-500 dark:text-slate-400">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {dictionary.projects.items.length > 0 && (
          <section className="animate-fade-in-up mb-8">
            <h2
              className={clsx(
                'mb-3 px-1 text-xs font-semibold tracking-wider text-slate-400 uppercase',
                'dark:text-slate-500'
              )}
            >
              {dictionary.projects.title}
            </h2>
            <div className="flex flex-col gap-2.5">
              {dictionary.projects.items.map((project) => (
                <a
                  key={project.name}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={clsx(
                    'group rounded-xl border p-4 transition-all',
                    'border-slate-200/60 bg-white/60 backdrop-blur-sm',
                    'hover:border-theme-500/40 hover:shadow-md',
                    'dark:border-white/5 dark:bg-slate-900/40',
                    'dark:hover:border-theme-400/30'
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3
                        className={clsx(
                          'mb-1 text-sm font-semibold text-slate-900 transition-colors',
                          'group-hover:text-theme-600',
                          'dark:text-slate-100 dark:group-hover:text-theme-400'
                        )}
                      >
                        {project.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {project.description}
                      </p>
                    </div>
                    <span className="mt-0.5 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-600">
                      →
                    </span>
                  </div>
                  {project.tags && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className={clsx(
                            'rounded-md px-1.5 py-0.5 font-mono text-[10px]',
                            'bg-slate-100 text-slate-500',
                            'dark:bg-white/5 dark:text-slate-400'
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
        <section className="animate-fade-in-up text-center">
          <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
            {dictionary.contact.cta}
          </p>
          {email && (
            <a
              href={`mailto:${email}`}
              className={clsx(
                'inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium transition-all',
                'border-theme-500/30 text-theme-600',
                'hover:border-theme-500/60 hover:bg-theme-500/5 hover:shadow-sm',
                'dark:border-theme-400/30 dark:text-theme-400',
                'dark:hover:border-theme-400/50 dark:hover:bg-theme-400/5'
              )}
            >
              <AiOutlineMail className="h-4 w-4" />
              {email}
            </a>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-[10px] text-slate-300 dark:text-slate-700">
            © {new Date().getFullYear()} {profile.name}
          </p>
        </footer>
      </div>
    </div>
  );
}

function LinkPill({
  href,
  icon: Icon,
  label,
  external,
  muted,
}: {
  href: string;
  icon: IconType;
  label: string;
  external?: boolean;
  muted?: boolean;
}) {
  const classes = clsx(
    'group flex items-center gap-3 rounded-xl border px-4 transition-all',
    muted ? 'py-2' : 'py-3',
    muted
      ? [
          'border-slate-200/30 bg-white/30',
          'hover:border-slate-200/60 hover:bg-white/50',
          'dark:border-white/3 dark:bg-slate-900/20',
          'dark:hover:border-white/5 dark:hover:bg-slate-900/40',
        ]
      : [
          'border-slate-200/60 bg-white/60 backdrop-blur-sm',
          'hover:border-theme-500/40 hover:shadow-md hover:scale-[1.01]',
          'dark:border-white/5 dark:bg-slate-900/40',
          'dark:hover:border-theme-400/30',
        ]
  );

  const content = (
    <>
      <Icon
        className={clsx(
          'transition-colors',
          muted ? 'h-4 w-4' : 'h-5 w-5',
          muted
            ? 'text-slate-300 group-hover:text-slate-400 dark:text-slate-600 dark:group-hover:text-slate-500'
            : 'text-slate-400 group-hover:text-theme-600 dark:text-slate-500 dark:group-hover:text-theme-400'
        )}
      />
      <span
        className={clsx(
          'flex-1 font-medium transition-colors',
          muted ? 'text-xs' : 'text-sm',
          muted
            ? 'text-slate-400 group-hover:text-slate-500 dark:text-slate-500 dark:group-hover:text-slate-400'
            : 'text-slate-700 group-hover:text-slate-900 dark:text-slate-300 dark:group-hover:text-slate-100'
        )}
      >
        {label}
      </span>
      <span
        className={clsx(
          'transition-transform group-hover:translate-x-0.5',
          muted
            ? 'text-slate-200 dark:text-slate-700'
            : 'text-slate-300 dark:text-slate-600'
        )}
      >
        →
      </span>
    </>
  );

  if (external || href.startsWith('mailto:')) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={classes}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes}>
      {content}
    </Link>
  );
}

type GravatarProfile = {
  avatar_url?: string;
  avatar_alt_text?: string;
  display_name?: string;
  description?: string;
  job_title?: string;
  location?: string;
  profile_url?: string;
};

const GRAVATAR_HASH =
  'REDACTED';

async function fetchGravatarProfile(): Promise<GravatarProfile | null> {
  try {
    const res = await fetch(
      `https://api.gravatar.com/v3/profiles/${GRAVATAR_HASH}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return (await res.json()) as GravatarProfile;
  } catch {
    return null;
  }
}
