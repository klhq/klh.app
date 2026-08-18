import type { SkillLevel } from '@/types/resume';
import { FC } from 'react';
import { Badge } from '@/components/ui/badge';
import clsx from 'clsx';

interface SkillTagProps {
  level: SkillLevel;
  skill: string;
}

const SkillTag: FC<SkillTagProps> = ({ level, skill }) => {
  return (
    <Badge
      variant="outline"
      className={clsx(
        'h-auto px-2.5 py-1 font-mono text-xs transition-all duration-200 hover:scale-105 rounded-md',
        // Print styles
        'print:border-slate-300 print:bg-transparent print:p-0.5 print:px-1.5 print:text-[10px]',
        {
          // Proficiency (Theme Colored)
          [clsx(
            'from-gradient-from-light/10 via-gradient-via-light/10 to-gradient-to-light/10 bg-linear-to-br',
            'dark:from-gradient-from-dark/20 dark:via-gradient-via-dark/20 dark:to-gradient-to-dark/20',
            'border-theme-500/30 hover:shadow-theme-500/20 hover:shadow-md',
            'text-theme-600 dark:text-theme-400 font-semibold',
            'print:text-theme-600 print:border-theme-200 print:font-semibold'
          )]: level === 'proficiency',

          // Familiar (Slate 100)
          [clsx(
            'bg-slate-100 dark:bg-slate-800',
            'border-slate-200 dark:border-white/10',
            'hover:bg-slate-200 hover:shadow-md dark:hover:bg-slate-700',
            'font-medium text-slate-700 dark:text-slate-300',
            'print:text-slate-700'
          )]: level === 'familiar',

          // Knowledge (Transparent)
          [clsx(
            'bg-transparent',
            'border-slate-200 dark:border-white/5',
            'hover:bg-slate-50 hover:shadow-sm dark:hover:bg-slate-800/50',
            'font-normal text-slate-500 dark:text-slate-400',
            'print:border-slate-200 print:text-slate-500'
          )]: level === 'knowledge',
        }
      )}
    >
      {skill}
    </Badge>
  );
};

export default SkillTag;
