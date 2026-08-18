'use client';
import { FC, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Settings, X } from 'lucide-react';
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
import { trackEvent } from '@/lib/analytics';
import ThemeSwitcher from './ThemeSwitcher';
import ColorPresetSwitcher from './ColorPresetSwitcher';
import PrintButton from './PrintButton';
import Button from './Button';
import { isPreviewMode } from '@/lib/preview';
import clsx from 'clsx';

const LOCALE_LABELS: Record<string, string> = {
  en: 'EN',
  'zh-TW': '繁',
  'zh-CN': '简',
};

const LOCALES = Object.keys(LOCALE_LABELS);

interface SettingsMenuProps {
  locale: string;
}

const SettingsMenu: FC<SettingsMenuProps> = ({ locale }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const isPreview = isPreviewMode();
  const pathname = usePathname();

  const isResumePage = pathname.endsWith('/resume');
  const showLocaleSwitcher = !isResumePage || isPreview;
  const showColorPresetSwitcher = isPreview;
  const showPrint = isResumePage;

  return (
    <div className="fixed top-4 right-4 z-50 print:hidden">
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setLangOpen(false);
        }}
      >
        <Tooltip>
          <TooltipTrigger
            render={
              <PopoverTrigger
                render={
                  <Button
                    aria-label="Settings"
                  />
                }
              />
            }
          >
            <div className="relative size-6">
              <Settings
                className={clsx(
                  'absolute inset-0 size-6 transition-all duration-300 group-hover:rotate-45 group-active:scale-90',
                  isOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
                )}
              />
              <X
                className={clsx(
                  'absolute inset-0 size-6 transition-all duration-300 group-hover:rotate-90 group-active:scale-90',
                  isOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
                )}
              />
            </div>
          </TooltipTrigger>
          <TooltipContent side="left">{isOpen ? 'Close settings' : 'Settings'}</TooltipContent>
        </Tooltip>

        <PopoverContent
          align="end"
          side="bottom"
          sideOffset={12}
          className="flex w-auto flex-col items-end gap-3 border-0 bg-transparent p-0 shadow-none ring-0 focus-visible:outline-none"
        >
          <ThemeSwitcher />

          {showColorPresetSwitcher && <ColorPresetSwitcher />}

          {showLocaleSwitcher && (
            <div className="relative flex items-center justify-end gap-2">
              {/* Expanded locale options */}
              <div
                className={clsx(
                  'flex gap-1.5 transition-all duration-200',
                  langOpen
                    ? 'translate-x-0 scale-100 opacity-100'
                    : 'pointer-events-none translate-x-4 scale-95 opacity-0'
                )}
              >
                {LOCALES.filter((l) => l !== locale).map((l) => {
                  const targetPath = pathname.replace(`/${locale}`, `/${l}`);
                  return (
                    <Link
                      key={l}
                      href={targetPath}
                      onClick={() => {
                        trackEvent('locale_switch', { locale: l });
                        setLangOpen(false);
                      }}
                      className="glass-button group"
                      title={l}
                      aria-label={`Switch to ${l}`}
                    >
                      <span className="text-xs font-bold">
                        {LOCALE_LABELS[l]}
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* Current locale button */}
              <Tooltip>
                <TooltipTrigger
                  render={
                    <Button
                      onClick={() => setLangOpen(!langOpen)}
                      aria-label="Switch language"
                      aria-expanded={langOpen}
                      aria-haspopup="true"
                    />
                  }
                >
                  <span className="text-xs font-bold transition-all duration-300 group-hover:scale-110 group-active:scale-90">
                    {LOCALE_LABELS[locale]}
                  </span>
                </TooltipTrigger>
                <TooltipContent side="left">{`Language: ${LOCALE_LABELS[locale]}`}</TooltipContent>
              </Tooltip>
            </div>
          )}

          {showPrint && <PrintButton />}
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default SettingsMenu;
