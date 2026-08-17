import BackButton from '@/components/BackButton';

export default async function BlogLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="relative">
      <BackButton href={`/${locale}`} />
      {children}
    </div>
  );
}
