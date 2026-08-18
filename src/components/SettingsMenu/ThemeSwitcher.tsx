'use client';
import { FC } from 'react';
import { Moon, Sun, SunMoon } from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { trackEvent } from '@/lib/analytics';
import { useTheme } from '@klh-app/use-theme';
import Button from './Button';
import clsx from 'clsx';

const CYCLE: Record<string, string> = {
  system: 'light',
  light: 'dark',
  dark: 'system',
};

const LABELS: Record<string, string> = {
  system: 'System theme',
  light: 'Light theme',
  dark: 'Dark theme',
};

const ThemeSwitcher: FC = () => {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    const next = CYCLE[theme] ?? 'system';
    setTheme(next);
    trackEvent('theme_toggle', { theme: next });
  };

  const label = LABELS[theme] ?? 'Toggle theme';

  const iconClasses =
    'absolute inset-0 size-6 transition-all duration-300 group-hover:rotate-12 group-active:scale-90';

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            onClick={handleToggle}
            aria-label={label}
          />
        }
      >
        <div className="relative size-6">
          <SunMoon
            className={clsx(
              iconClasses,
              theme === 'system' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            )}
          />
          <Sun
            className={clsx(
              iconClasses,
              theme === 'light' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            )}
          />
          <Moon
            className={clsx(
              iconClasses,
              theme === 'dark' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
            )}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent side="left">{label}</TooltipContent>
    </Tooltip>
  );
};

export default ThemeSwitcher;
