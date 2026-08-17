'use client';
import { FC, useState, useEffect } from 'react';
import { MdPalette } from 'react-icons/md';
import { THEME_PRESET_NAMES, getPresetCSSVariables } from '@/theme';
import Button from './Button';
import clsx from 'clsx';

const PRESET_LABELS: Record<string, string> = {
  default: 'Default (Purple)',
  meta: 'Meta',
  amazon: 'Amazon',
  apple: 'Apple',
  microsoft: 'Microsoft',
  netflix: 'Netflix',
  spotify: 'Spotify',
  canva: 'Canva',
  'trust-wallet': 'Trust Wallet',
};

const ColorPresetSwitcher: FC = () => {
  const [open, setOpen] = useState(false);
  const [activePreset, setActivePreset] = useState('default');

  // Restore saved preset from localStorage after mount to avoid SSR hydration mismatch
  useEffect(() => {
    try {
      const saved = localStorage.getItem('klh_color_preset');
      if (saved && THEME_PRESET_NAMES.includes(saved)) {
        setActivePreset(saved); // eslint-disable-line react-hooks/set-state-in-effect -- intentional: syncing browser-only localStorage state after mount
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Apply CSS variables whenever the active preset changes
  useEffect(() => {
    const vars = getPresetCSSVariables(activePreset);
    const root = document.documentElement;
    for (const [key, val] of Object.entries(vars)) {
      root.style.setProperty(key, val);
    }
  }, [activePreset]);

  const selectPreset = (presetName: string) => {
    setActivePreset(presetName);
    try {
      localStorage.setItem('klh_color_preset', presetName);
    } catch {
      // Ignore storage errors
    }
  };

  return (
    <div className="relative flex items-center justify-end gap-2">
      {/* Preset dropdown list */}
      <div
        className={clsx(
          'absolute top-12 right-0 z-50 flex max-h-60 w-44 flex-col gap-1 overflow-y-auto rounded-lg border border-slate-200 bg-white/90 p-2 shadow-xl backdrop-blur-md transition-all duration-200',
          'dark:border-white/10 dark:bg-slate-800/90',
          open
            ? 'translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-2 scale-95 opacity-0'
        )}
      >
        <div className="mb-1 border-b border-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-white/5 dark:text-slate-500">
          Color Scheme
        </div>
        {THEME_PRESET_NAMES.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => {
              selectPreset(name);
              setOpen(false);
            }}
            className={clsx(
              'rounded px-2 py-1.5 text-left text-xs transition-colors',
              activePreset === name
                ? 'bg-theme-600 font-semibold text-white dark:bg-theme-500'
                : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10'
            )}
          >
            {PRESET_LABELS[name] || name}
          </button>
        ))}
      </div>

      <Button
        onClick={() => setOpen(!open)}
        title={`Color System (${PRESET_LABELS[activePreset] || activePreset})`}
        aria-label="Switch color preset"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <MdPalette className="size-6 transition-all duration-300 group-hover:rotate-12 group-active:scale-90" />
      </Button>
    </div>
  );
};

export default ColorPresetSwitcher;
