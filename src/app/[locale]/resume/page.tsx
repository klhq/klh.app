import type { Metadata } from 'next';
import { FC } from 'react';
import clsx from 'clsx';
import BackButton from '@/components/BackButton';
import Bios from '@/components/resume/Bios';
import Sidebar from '@/components/resume/Sidebar';
import TimelineList from '@/components/resume/TimelineList';
import {
  DEFAULT_LOCALE,
  SUPPORTED_LOCALES,
  getResumeData,
  getResumeDictionary,
  type Locale,
} from '@/lib/i18n';
import { isPreviewMode } from '@/lib/preview';

interface ResumePageProps {
  params: Promise<{ locale: string }>;
}

// Chinese resume routes only exist in preview/dev — dynamicParams=false below
// makes any locale not returned here 404 in production instead of rendering.
export function generateStaticParams() {
  if (isPreviewMode()) {
    return SUPPORTED_LOCALES.map((locale) => ({ locale }));
  }
  return [{ locale: DEFAULT_LOCALE }];
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: ResumePageProps): Promise<Metadata> {
  const { locale } = await params;
  const dictionary = await getResumeDictionary(locale as Locale);
  const availableLocales = isPreviewMode() ? SUPPORTED_LOCALES : [DEFAULT_LOCALE];
  return {
    title: dictionary.pageTitle,
    alternates: {
      languages: Object.fromEntries(
        availableLocales.map((l) => [l, `/${l}/resume`])
      ),
    },
    openGraph: {
      locale,
    },
  };
}

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
  const [{ profile, socialLinks, skillSet, workExperience, education }, dictionary] =
    await Promise.all([
      getResumeData(locale as Locale),
      getResumeDictionary(locale as Locale),
    ]);

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
            dictionary={dictionary}
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
              title={dictionary.sections.workExperience}
              data={workExperience}
              nameMap={dictionary.companyNames}
            />
          </main>
        </div>
      </div>

      <BackButton href={`/${locale}`} />
    </div>
  );
}
