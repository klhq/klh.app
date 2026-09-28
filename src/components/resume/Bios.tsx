import { FC } from 'react';
import type { ProfileData } from '@/types/resume';
import clsx from 'clsx';

interface BiosProps {
  profile: ProfileData;
}

const Bios: FC<BiosProps> = ({ profile }) => (
  <div className="flex flex-col gap-4 print:gap-2">
    <div className="flex flex-col">
      <h1
        className={clsx(
          'mb-2 text-4xl font-extrabold tracking-tighter text-slate-900 uppercase',
          'dark:text-slate-50',
          'sm:text-5xl lg:text-6xl',
          // Print Styles
          'print:mb-0.5 print:text-3xl print:leading-[1.1]'
        )}
      >
        {profile.name}
      </h1>
      <div
        className={clsx(
          'text-theme-600 text-xl font-semibold',
          'dark:text-theme-400',
          'sm:text-2xl',
          // Print Styles
          'print:text-lg print:font-medium'
        )}
      >
        {profile.target}
      </div>
    </div>
    <div
      className={clsx(
        'max-w-3xl text-base leading-relaxed text-slate-600',
        'dark:text-slate-300',
        // Print Styles
        'print:text-[13px] print:leading-normal'
      )}
    >
      {profile.summary}
    </div>
  </div>
);

export default Bios;
