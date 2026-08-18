import type { Metadata } from 'next';
import Script from 'next/script';
import { JetBrains_Mono, Geist } from 'next/font/google';
import { ThemeProvider, ThemeScript } from '@klh-app/use-theme';
import { TooltipProvider } from '@/components/ui/tooltip';
import './globals.css';
import { getThemeCSSVariables } from '@/theme';
import { cn } from "@/lib/utils";

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'Segoe UI',
    'Roboto',
    'PingFang TC',
    'PingFang SC',
    'Noto Sans TC',
    'Noto Sans SC',
    'Microsoft JhengHei',
    'Microsoft YaHei',
    'sans-serif',
  ],
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  fallback: [
    'ui-monospace',
    'SFMono-Regular',
    'Menlo',
    'Monaco',
    'Consolas',
    'Liberation Mono',
    'Courier New',
    'PingFang TC',
    'Microsoft JhengHei',
    'monospace',
  ],
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
      className={cn("print:hidden", "font-sans", geist.variable)}
      lang="en"
      style={themeCSSVariables as React.CSSProperties}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript attribute="class" value={{ dark: 'dark' }} />
      </head>
      <body className={`${geist.variable} ${jetbrainsMono.variable} font-sans`}>
        <ThemeProvider attribute="class" value={{ dark: 'dark' }}>
          <TooltipProvider delay={200}>
            {children}
          </TooltipProvider>
        </ThemeProvider>
        {process.env.NEXT_PUBLIC_UMAMI_ID && (
          <Script
            defer
            src="/stats/stats.js"
            data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
            data-host-url="/stats"
          />
        )}
      </body>
    </html>
  );
}
