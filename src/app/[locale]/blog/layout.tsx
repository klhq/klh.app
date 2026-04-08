import Link from 'next/link';

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
      <nav className="fixed top-4 left-4 z-50">
        <Link
          href={`/${locale}`}
          className="glass-button group"
          title="Back to home"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
            ←
          </span>
        </Link>
      </nav>
      {children}
    </div>
  );
}
