import { notFound } from 'next/navigation';
import { SUPPORTED_LOCALES, isValidLocale } from '@/lib/i18n';
import LocaleSwitcher from '@/components/LocaleSwitcher';

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <>
      <nav className="fixed top-4 right-4 z-50 print:hidden">
        <LocaleSwitcher locale={locale} />
      </nav>
      {children}
    </>
  );
}
