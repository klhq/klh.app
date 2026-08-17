import themesData from './themes.json';

export interface ThemeColors {
  primary500: string;
  primary600: string;
  primary400: string;
  gradientFromLight: string;
  gradientViaLight: string;
  gradientToLight: string;
  gradientFromDark: string;
  gradientViaDark: string;
  gradientToDark: string;
  blob1: string;
  blob2: string;
  blob3: string;
  blob4: string;
  printAccent: string;
  printText: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { $schema: _schema, ...themePresets } = themesData as Record<
  string,
  unknown
>;
export const THEME_PRESETS: Record<string, ThemeColors> = themePresets as Record<
  string,
  ThemeColors
>;

export const THEME_PRESET_NAMES = Object.keys(THEME_PRESETS);

export function getThemeColors(): ThemeColors {
  const presetName = process.env.NEXT_PUBLIC_THEME_PRESET;
  if (presetName && THEME_PRESETS[presetName]) {
    return THEME_PRESETS[presetName];
  }

  const DEFAULT_COLORS: ThemeColors = THEME_PRESETS.default;

  return {
    primary500:
      process.env.NEXT_PUBLIC_COLOR_PRIMARY_500 || DEFAULT_COLORS.primary500,
    primary600:
      process.env.NEXT_PUBLIC_COLOR_PRIMARY_600 || DEFAULT_COLORS.primary600,
    primary400:
      process.env.NEXT_PUBLIC_COLOR_PRIMARY_400 || DEFAULT_COLORS.primary400,

    gradientFromLight:
      process.env.NEXT_PUBLIC_GRADIENT_FROM_LIGHT ||
      DEFAULT_COLORS.gradientFromLight,
    gradientViaLight:
      process.env.NEXT_PUBLIC_GRADIENT_VIA_LIGHT ||
      DEFAULT_COLORS.gradientViaLight,
    gradientToLight:
      process.env.NEXT_PUBLIC_GRADIENT_TO_LIGHT ||
      DEFAULT_COLORS.gradientToLight,

    gradientFromDark:
      process.env.NEXT_PUBLIC_GRADIENT_FROM_DARK ||
      DEFAULT_COLORS.gradientFromDark,
    gradientViaDark:
      process.env.NEXT_PUBLIC_GRADIENT_VIA_DARK ||
      DEFAULT_COLORS.gradientViaDark,
    gradientToDark:
      process.env.NEXT_PUBLIC_GRADIENT_TO_DARK || DEFAULT_COLORS.gradientToDark,

    blob1: process.env.NEXT_PUBLIC_BLOB_COLOR_1 || DEFAULT_COLORS.blob1,
    blob2: process.env.NEXT_PUBLIC_BLOB_COLOR_2 || DEFAULT_COLORS.blob2,
    blob3: process.env.NEXT_PUBLIC_BLOB_COLOR_3 || DEFAULT_COLORS.blob3,
    blob4: process.env.NEXT_PUBLIC_BLOB_COLOR_4 || DEFAULT_COLORS.blob4,

    printAccent:
      process.env.NEXT_PUBLIC_PRINT_ACCENT || DEFAULT_COLORS.printAccent,
    printText: process.env.NEXT_PUBLIC_PRINT_TEXT || DEFAULT_COLORS.printText,
  };
}

export function getPresetCSSVariables(presetName: string): Record<string, string> {
  const colors = THEME_PRESETS[presetName] || getThemeColors();
  return {
    '--theme-primary-400': colors.primary400,
    '--theme-primary-500': colors.primary500,
    '--theme-primary-600': colors.primary600,
    '--theme-blob-1': colors.blob1,
    '--theme-blob-2': colors.blob2,
    '--theme-blob-3': colors.blob3,
    '--theme-blob-4': colors.blob4,
    '--theme-gradient-from-light': colors.gradientFromLight,
    '--theme-gradient-via-light': colors.gradientViaLight,
    '--theme-gradient-to-light': colors.gradientToLight,
    '--theme-gradient-from-dark': colors.gradientFromDark,
    '--theme-gradient-via-dark': colors.gradientViaDark,
    '--theme-gradient-to-dark': colors.gradientToDark,
    '--theme-print-accent': colors.printAccent,
    '--theme-print-text': colors.printText,
  };
}

export function getThemeCSSVariables(): Record<string, string> {
  const colors = getThemeColors();
  return {
    '--theme-primary-400': colors.primary400,
    '--theme-primary-500': colors.primary500,
    '--theme-primary-600': colors.primary600,
    '--theme-blob-1': colors.blob1,
    '--theme-blob-2': colors.blob2,
    '--theme-blob-3': colors.blob3,
    '--theme-blob-4': colors.blob4,
    '--theme-gradient-from-light': colors.gradientFromLight,
    '--theme-gradient-via-light': colors.gradientViaLight,
    '--theme-gradient-to-light': colors.gradientToLight,
    '--theme-gradient-from-dark': colors.gradientFromDark,
    '--theme-gradient-via-dark': colors.gradientViaDark,
    '--theme-gradient-to-dark': colors.gradientToDark,
    '--theme-print-accent': colors.printAccent,
    '--theme-print-text': colors.printText,
  };
}
