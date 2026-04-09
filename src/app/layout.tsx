import type { Metadata } from 'next';
import Script from 'next/script';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider, ThemeScript } from '@klh-app/theme';
import './globals.css';
import { getThemeCSSVariables } from '@/theme';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'KL Hsu',
  description: 'Personal site — resume, blog, and experiments',
};

const themeCSSVariables = getThemeCSSVariables();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className="print:hidden"
      lang="en"
      style={themeCSSVariables as React.CSSProperties}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript attribute="class" value={{ dark: 'dark' }} />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider attribute="class" value={{ dark: 'dark' }}>
          {children}
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_UMAMI_URL && process.env.NEXT_PUBLIC_UMAMI_ID && (
          <Script
            defer
            src={process.env.NEXT_PUBLIC_UMAMI_URL}
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
          />
        )}
      </body>
    </html>
  );
}
