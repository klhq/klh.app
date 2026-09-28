import { FC } from 'react';
import clsx from 'clsx';

interface TimelineListTitleProps {
  compact?: boolean;
  children: string;
}

const TimelineListTitle: FC<TimelineListTitleProps> = ({
  compact,
  children,
}) => {
  if (compact) {
    return (
      <div className="mb-4 text-xs font-bold tracking-wider text-slate-400 uppercase dark:text-slate-500 print:break-after-avoid">
        {children}
      </div>
    );
  }

  return (
    <div className="mb-6 w-fit print:break-after-avoid">
      <h2
        className={clsx(
          'pb-2 text-sm font-bold tracking-[0.2em] text-slate-500 uppercase',
          'dark:text-slate-500',
          'print:text-sm'
        )}
      >
        {children}
      </h2>
      <div
        className={clsx(
          'h-0.5 w-full',
          // Light Mode Gradient
          'from-gradient-from-light via-gradient-via-light to-gradient-to-light bg-linear-to-r',
          // Dark Mode Gradient
          'dark:from-gradient-from-dark dark:via-gradient-via-dark dark:to-gradient-to-dark',
          'print:[print-color-adjust:exact]'
        )}
      />
    </div>
  );
};

export default TimelineListTitle;
