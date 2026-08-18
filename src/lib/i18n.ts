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

export async function getDictionary(
  locale: Locale
): Promise<LandingDictionary> {
  const filePath = path.join(CONTENT_DIR, 'landing', `${locale}.json`);
  const data = await readJsonFile<LandingDictionary>(filePath);
  if (data) return data;

  // Fallback to English
  if (locale !== DEFAULT_LOCALE) {
    const fallback = await readJsonFile<LandingDictionary>(
      path.join(CONTENT_DIR, 'landing', `${DEFAULT_LOCALE}.json`)
    );
    if (fallback) return fallback;
  }

  throw new Error(`[i18n] No dictionary found for locale "${locale}"`);
}

export async function getResumeData(locale: Locale): Promise<ResumeData> {
  const filePath = path.join(
    CONTENT_DIR,
    'resume',
    locale,
    'data.jsonc'
  );
  const data = await readJsoncFile<ResumeData>(filePath);
  if (data) return data;

  // Fallback to English
  if (locale !== DEFAULT_LOCALE) {
    const fallback = await readJsoncFile<ResumeData>(
      path.join(CONTENT_DIR, 'resume', DEFAULT_LOCALE, 'data.jsonc')
    );
    if (fallback) return fallback;
  }

  throw new Error(`[i18n] No resume data found for locale "${locale}"`);
}

export async function getResumeDictionary(
  locale: Locale
): Promise<ResumeDictionary> {
  const filePath = path.join(MESSAGES_DIR, 'resume-ui', `${locale}.json`);
  const data = await readJsonFile<ResumeDictionary>(filePath);
  if (data) return data;

  // Fallback to English
  if (locale !== DEFAULT_LOCALE) {
    const fallback = await readJsonFile<ResumeDictionary>(
      path.join(MESSAGES_DIR, 'resume-ui', `${DEFAULT_LOCALE}.json`)
    );
    if (fallback) return fallback;
  }

  throw new Error(`[i18n] No resume dictionary found for locale "${locale}"`);
}
