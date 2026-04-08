import type { Metadata } from 'next';
import { FC } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import SettingsMenu from '@/components/resume/SettingMenu';
import Bios from '@/components/resume/Bios';
import Sidebar from '@/components/resume/Sidebar';
import TimelineList from '@/components/resume/TimelineList';
import EngagementTracker from '@/components/resume/EngagementTracker';
import { SUPPORTED_LOCALES, getResumeData, type Locale } from '@/lib/i18n';

interface ResumePageProps {
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: ResumePageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: `Resume — KL Hsu`,
    alternates: {
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `/${l}/resume`])
      ),
    },
    openGraph: {
      locale,
    },
  };
}

const COMPANY_NAME_MAP = {
  linker: 'Linker Networks Inc.',
  appier: 'Appier Inc.',
  cdc: 'Crypto.com',
  cronos: 'Cronos Labs',
} as const;

const BackgroundBlobs: FC = () => (
  <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden print:hidden">
    <div className="bg-blob-1/5 absolute -top-40 -left-40 h-96 w-96 rounded-full blur-[100px]" />
    <div className="bg-blob-2/5 absolute -top-20 -right-20 h-80 w-80 rounded-full blur-[120px]" />
    <div className="bg-blob-3/5 absolute -bottom-40 -left-20 h-96 w-96 rounded-full blur-[100px]" />
    <div className="bg-blob-4/5 absolute top-1/2 -right-40 h-80 w-80 rounded-full blur-[120px]" />
  </div>
);

export default async function ResumePage({ params }: ResumePageProps) {
  const { locale } = await params;
  const { profile, socialLinks, skillSet, workExperience, education } =
    await getResumeData(locale as Locale);

  return (
    <div
      className={clsx(
        'relative min-h-screen bg-slate-950 text-slate-900',
        'dark:bg-slate-950 dark:text-slate-50',
        'print:min-h-0 print:bg-white'
      )}
    >
      <BackgroundBlobs />

      <div
        className={clsx(
          'm-auto min-h-screen w-full max-w-300 bg-white shadow-xl',
          'dark:bg-slate-900 dark:shadow-none',
          'print:min-h-0 print:w-full print:max-w-none print:shadow-none'
        )}
      >
        {/* Header (Bios) */}
        <header
          className={clsx(
            'animate-fade-in-down border-b border-slate-100 p-6',
            'md:p-12',
            'dark:border-white/5',
            'print:border-b print:border-slate-300 print:p-4 print:pb-3'
          )}
        >
          <Bios profile={profile} />
        </header>

        {/* Main Content Grid */}
        <div
          className={clsx(
            'grid grid-cols-1',
            'md:grid-cols-[300px_1fr]',
            'print:grid-cols-[240px_1fr]'
          )}
        >
          <Sidebar
            socialLinks={socialLinks}
            skillSet={skillSet}
            education={education}
            printEmail={process.env.PRINT_EMAIL}
          />

          {/* Main Content (Work Experience) */}
          <main
            className={clsx(
              'animate-fade-in-up flex flex-col gap-8 p-6',
              'md:p-12',
              'print:gap-4 print:p-4 print:text-[10px]'
            )}
          >
            <TimelineList
              title="Work Experience"
              data={workExperience}
              nameMap={COMPANY_NAME_MAP}
            />
          </main>
        </div>
      </div>

      <Link
        href="/blog"
        className={clsx(
          'fixed top-4 left-4 z-50 rounded-full border border-slate-200 bg-white/50 px-4 py-2 text-sm font-medium text-slate-600 shadow-md backdrop-blur-sm transition-all duration-200 print:hidden',
          'hover:border-theme-600/50 hover:text-theme-600 hover:shadow-lg',
          'dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-300',
          'dark:hover:border-theme-400/50 dark:hover:text-theme-400'
        )}
      >
        Blog
      </Link>
      <SettingsMenu />
      <EngagementTracker />
    </div>
  );
}
