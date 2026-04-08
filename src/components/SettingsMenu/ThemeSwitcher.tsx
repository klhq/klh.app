'use client';
import { FC } from 'react';
import { MdDarkMode, MdLightMode, MdDevices } from 'react-icons/md';
import { sendGAEvent } from '@next/third-parties/google';
import { useTheme } from '@klh-app/theme';
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
    sendGAEvent('event', 'theme_toggle', { theme: next });
  };

  const iconClasses =
    'absolute inset-0 size-6 transition-all duration-300 group-hover:rotate-12 group-active:scale-90';

  return (
    <Button onClick={handleToggle} title={LABELS[theme] ?? 'Toggle theme'}>
      <div className="relative size-6">
        <MdDevices
          className={clsx(
            iconClasses,
            theme === 'system' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          )}
        />
        <MdLightMode
          className={clsx(
            iconClasses,
            theme === 'light' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          )}
        />
        <MdDarkMode
          className={clsx(
            iconClasses,
            theme === 'dark' ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
          )}
        />
      </div>
    </Button>
  );
};

export default ThemeSwitcher;
