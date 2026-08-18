import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import clsx from 'clsx';
import {
  SUPPORTED_LOCALES,
  getDictionary,
  type Locale,
} from '@/lib/i18n';
import { getAllPosts } from '@/lib/blog';
import { Badge } from '@/components/ui/badge';
import FooterEasterEgg from '@/components/FooterEasterEgg';
import CopyEmailPill from '@/components/CopyEmailPill';
import LinkPill from '@/components/LinkPill';
import TrackedLink from '@/components/TrackedLink';

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
  const gravatar = await fetchGravatarProfile();
  const description =
    gravatar?.description?.split('\n')[0] ??
    'Software engineer building web & decentralized applications';

  return {
    title: gravatar?.display_name ?? 'KL Hsu',
    description,
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `/${l}`])
      ),
    },
    openGraph: { locale },
  };
}

const SERVICE_ICON_NAMES: Record<string, string> = {
  github: 'github',
  linkedin: 'linkedin',
  bluesky: 'bluesky',
  telegram: 'telegram',
  twitter: 'twitter',
};

const SERVICE_LABELS: Record<string, string> = {
  github: 'GitHub',
  linkedin: 'LinkedIn',
  bluesky: 'Bluesky',
  telegram: 'Telegram',
  twitter: 'X (Twitter)',
};

export default async function LandingPage({ params }: LandingPageProps) {
  const { locale } = await params;
  const [dictionary, gravatar, posts] = await Promise.all([
    getDictionary(locale as Locale),
    fetchGravatarProfile(),
    getAllPosts(),
  ]);

  const name = gravatar?.display_name ?? 'KL Hsu';
  const email = gravatar?.contact_info?.email ?? '';
  const verifiedAccounts = gravatar?.verified_accounts ?? [];
  const recentPosts = posts.slice(0, 4);
  const quotes = await loadQuotes();

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
              alt={gravatar.avatar_alt_text || name}
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
              'mb-1 text-2xl font-bold tracking-tight text-slate-900',
              'dark:text-slate-50'
            )}
          >
            {name}
          </h1>
          {gravatar?.job_title && (
            <p className="mb-1 text-sm font-medium text-slate-600 dark:text-slate-300">
              {gravatar.job_title}
            </p>
          )}
          {gravatar?.location && (
            <p className="mb-2 inline-flex items-center justify-center gap-1 font-mono text-[10px] text-slate-400 dark:text-slate-500">
              <MapPin className="size-3 shrink-0" />
              <span>{gravatar.location}</span>
            </p>
          )}
          {gravatar?.description && (
            <p className="mb-3 text-xs text-slate-400 dark:text-slate-500">
              {gravatar.description}
            </p>
          )}
          {gravatar?.interests && gravatar.interests.length > 0 && (
            <div className="mx-auto mb-4 flex max-w-xs flex-wrap justify-center gap-1.5">
              {gravatar.interests.map((interest) => (
                <Badge
                  key={interest.id}
                  variant="outline"
                  className="rounded-full text-[10px] font-normal border-slate-200/60 dark:border-white/5 bg-slate-100/50 dark:bg-white/5 text-slate-500 dark:text-slate-400"
                >
                  {interest.name}
                </Badge>
              ))}
            </div>
          )}

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
            href={`/${locale}/blog`}
            icon="pencil"
            label={dictionary.nav.blog}
          />
          {verifiedAccounts
            .filter((a) => !a.is_hidden)
            .map((account) => (
              <LinkPill
                key={account.service_type}
                href={account.url}
                icon={SERVICE_ICON_NAMES[account.service_type] ?? 'globe'}
                label={
                  SERVICE_LABELS[account.service_type] ??
                  account.service_label
                }
                external
              />
            ))}
          {email && <CopyEmailPill email={email} />}
          <LinkPill
            href={`/${locale}/resume`}
            icon="document"
            label={dictionary.nav.resume}
            muted
          />
        </section>

        {/* Now */}
        {dictionary.now && dictionary.now.items.length > 0 && (
          <section className="animate-fade-in-up mb-8">
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="section-label">
                {dictionary.now.title}
              </h2>
              {dictionary.now.updated && (
                <span className="font-mono text-[10px] text-slate-300 dark:text-slate-600">
                  {dictionary.now.updated}
                </span>
              )}
            </div>
            <div className="glass-card p-4">
              <ul className="flex flex-col gap-2">
                {dictionary.now.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300"
                  >
                    <span className="mt-0.5 text-theme-500/60">~</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Blog Carousel */}
        {recentPosts.length > 0 && (
          <section className="animate-fade-in-up mb-8">
            <div className="mb-3 flex items-center justify-between px-1">
              <h2 className="section-label">
                {dictionary.nav.blog}
              </h2>
              <Link
                href={`/${locale}/blog`}
                className="text-xs text-slate-400 transition-colors hover:text-theme-600 dark:text-slate-500 dark:hover:text-theme-400"
              >
                →
              </Link>
            </div>
            <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 scrollbar-none">
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/${locale}/blog/${post.slug}`}
                  className="glass-card-interactive group w-[260px] flex-none snap-start p-4"
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
            <h2 className="section-label mb-3 px-1">
              {dictionary.projects.title}
            </h2>
            <div className="flex flex-col gap-2.5">
              {dictionary.projects.items.map((project) => (
                <TrackedLink
                  key={project.name}
                  event="outbound_click"
                  data={{
                    source: 'project',
                    url: project.url,
                    label: project.name,
                  }}
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card-interactive group p-4"
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
                    <span className="hover-arrow mt-0.5">→</span>
                  </div>
                  {project.tags && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {project.tags.map((tag) => (
                        <span key={tag} className="tag-pill">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </TrackedLink>
              ))}
            </div>
          </section>
        )}

        <FooterEasterEgg name={name} quotes={quotes} />
      </div>
    </div>
  );
}

type GravatarVerifiedAccount = {
  service_type: string;
  service_label: string;
  service_icon: string;
  url: string;
  is_hidden: boolean;
};

type GravatarInterest = {
  id: number;
  name: string;
  slug: string;
};

type GravatarProfile = {
  avatar_url?: string;
  avatar_alt_text?: string;
  display_name?: string;
  description?: string;
  job_title?: string;
  location?: string;
  profile_url?: string;
  verified_accounts?: GravatarVerifiedAccount[];
  contact_info?: { email?: string };
  interests?: GravatarInterest[];
};

async function fetchGravatarProfile(): Promise<GravatarProfile | null> {
  const hash = process.env.GRAVATAR_HASH;
  if (!hash) return null;

  try {
    const headers: Record<string, string> = {};
    if (process.env.GRAVATAR_API_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GRAVATAR_API_TOKEN}`;
    }
    const res = await fetch(
      `https://api.gravatar.com/v3/profiles/${hash}`,
      { headers, next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    return (await res.json()) as GravatarProfile;
  } catch {
    return null;
  }
}

const FALLBACK_QUOTES = ['Shipped is better than perfect.'];

async function loadQuotes(): Promise<string[]> {
  try {
    const { readFile } = await import('node:fs/promises');
    const { join } = await import('node:path');
    const raw = await readFile(
      join(process.cwd(), 'src/content/quotes.json'),
      'utf8'
    );
    const quotes = JSON.parse(raw) as string[];
    return quotes.length > 0 ? quotes : FALLBACK_QUOTES;
  } catch {
    return FALLBACK_QUOTES;
  }
}
