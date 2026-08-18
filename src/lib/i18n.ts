import { readFile } from 'node:fs/promises';
import path from 'node:path';
import stripJsonComments from 'strip-json-comments';
import type { ResumeData } from '@/types/resume';
import type { LandingDictionary } from '@/types/landing';
import type { ResumeDictionary } from '@/types/resume-ui';
import { routing } from '@/i18n/routing';

export const SUPPORTED_LOCALES = routing.locales;
export const DEFAULT_LOCALE = routing.defaultLocale;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

const CONTENT_DIR = path.join(process.cwd(), 'src/content');
const MESSAGES_DIR = path.join(process.cwd(), 'src/messages');

// zh-CN has no Simplified Chinese resume content yet — reuse zh-TW's
// Traditional Chinese base rather than falling straight through to English.
const RESUME_LOCALE_FALLBACK: Partial<Record<Locale, Locale>> = {
  'zh-CN': 'zh-TW',
};

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

async function readJsoncFile<T>(filePath: string): Promise<T | null> {
  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(stripJsonComments(raw)) as T;
  } catch {
    return null;
  }
}

// Tries `locale`, then a mapped locale fallback (e.g. zh-CN -> zh-TW) if any,
// then English, in that order, using the first file that resolves.
async function readWithLocaleFallback<T>(
  locale: Locale,
  toPath: (locale: Locale) => string,
  reader: (filePath: string) => Promise<T | null>,
  localeFallbackMap: Partial<Record<Locale, Locale>>,
  errorLabel: string
): Promise<T> {
  const data = await reader(toPath(locale));
  if (data) return data;

  const localeFallback = localeFallbackMap[locale];
  if (localeFallback) {
    const fallback = await reader(toPath(localeFallback));
    if (fallback) return fallback;
  }

  if (locale !== DEFAULT_LOCALE) {
    const fallback = await reader(toPath(DEFAULT_LOCALE));
    if (fallback) return fallback;
  }

  throw new Error(`[i18n] No ${errorLabel} found for locale "${locale}"`);
}

export async function getDictionary(
  locale: Locale
): Promise<LandingDictionary> {
  return readWithLocaleFallback(
    locale,
    (l) => path.join(CONTENT_DIR, 'landing', `${l}.json`),
    readJsonFile<LandingDictionary>,
    {},
    'dictionary'
  );
}

export async function getResumeData(locale: Locale): Promise<ResumeData> {
  return readWithLocaleFallback(
    locale,
    (l) => path.join(CONTENT_DIR, 'resume', l, 'data.jsonc'),
    readJsoncFile<ResumeData>,
    RESUME_LOCALE_FALLBACK,
    'resume data'
  );
}

export async function getResumeDictionary(
  locale: Locale
): Promise<ResumeDictionary> {
  return readWithLocaleFallback(
    locale,
    (l) => path.join(MESSAGES_DIR, 'resume-ui', `${l}.json`),
    readJsonFile<ResumeDictionary>,
    RESUME_LOCALE_FALLBACK,
    'resume dictionary'
  );
}
