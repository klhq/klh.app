import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/stats/stats.js',
        destination: 'https://analytics.klh.app/script.js',
      },
      {
        source: '/stats/api/send',
        destination: 'https://analytics.klh.app/api/send',
      },
      {
        source: '/stats/event',
        destination: 'https://analytics.klh.app/event',
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

export default withNextIntl(nextConfig);
