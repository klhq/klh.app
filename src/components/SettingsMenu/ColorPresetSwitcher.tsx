'use client';
import { FC, useState, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
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
    setOpen(false);
  };

  const label = `Color System (${PRESET_LABELS[activePreset] || activePreset})`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip open={open ? false : undefined}>
        <TooltipTrigger
          render={
            <PopoverTrigger
              render={
                <Button
                  aria-label="Switch color preset"
                />
              }
            />
          }
        >
          <Palette className="size-6 transition-all duration-300 group-hover:rotate-12 group-active:scale-90" />
        </TooltipTrigger>
        <TooltipContent side="left">{label}</TooltipContent>
      </Tooltip>

      <PopoverContent
        align="end"
        side="left"
        sideOffset={12}
        className="w-48 p-2 backdrop-blur-md bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-white/10 shadow-xl"
      >
        <div className="mb-1 border-b border-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:border-white/5 dark:text-slate-500">
          Color Scheme
        </div>
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {THEME_PRESET_NAMES.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => selectPreset(name)}
              className={clsx(
                'flex items-center justify-between rounded px-2 py-1.5 text-left text-xs transition-colors cursor-pointer',
                activePreset === name
                  ? 'bg-theme-600 font-semibold text-white dark:bg-theme-500'
                  : 'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10'
              )}
            >
              <span>{PRESET_LABELS[name] || name}</span>
              {activePreset === name && <Check className="size-3.5 shrink-0" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPresetSwitcher;
