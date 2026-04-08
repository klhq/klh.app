import { ImageResponse } from 'next/og';
import { getThemeColors } from '@/theme';

// Ensure this is statically generated at build time
export const dynamic = 'force-static';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Generate separate metadata for Light and Dark modes
export function generateImageMetadata() {
  return [
    {
      id: 'light',
      alt: 'KL Hsu - Light',
      contentType: 'image/png',
      media: '(prefers-color-scheme: light)',
    },
    {
      id: 'dark',
      alt: 'KL Hsu - Dark',
      contentType: 'image/png',
      media: '(prefers-color-scheme: dark)',
    },
  ];
}

export default function Icon({ id }: { id: string }) {
  const colors = getThemeColors();
  const isDark = id === 'dark';

  const gradientFrom = isDark
    ? `rgb(${colors.primary400})`
    : `rgb(${colors.primary500})`;
  const gradientTo = isDark
    ? `rgb(${colors.primary600})`
    : `rgb(${colors.primary400})`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          borderRadius: 8,
        }}
      >
        <span
          style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: -1,
            lineHeight: 1,
          }}
        >
          K
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
