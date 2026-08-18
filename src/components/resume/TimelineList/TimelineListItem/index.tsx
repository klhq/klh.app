import { FC } from 'react';
import type { ExperienceInfo } from '@/types/resume';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import InfoContent from './InfoContent';
import clsx from 'clsx';

interface TimelineListItemProps {
  title: string;
  info: ExperienceInfo;
  compact?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

const CompactItem: FC<TimelineListItemProps> = ({
  title,
  info,
  isFirst,
  isLast,
}) => (
  <div
    className={clsx(
      'relative pb-6 break-inside-avoid pl-4',
      'last:pb-0',
      'print:pb-2'
    )}
  >
    {/* Vertical Line */}
    <Separator
      orientation="vertical"
      className={clsx(
        'absolute left-0 bg-slate-200 dark:bg-slate-700',
        isFirst ? 'top-1.5' : 'top-0',
        isLast ? 'h-1.5 bottom-auto' : 'bottom-0'
      )}
    />
    <div className="bg-theme-600 dark:bg-theme-400 absolute top-1.5 -left-0.75 h-1.5 w-1.5 rounded-full" />
    <div className="mb-1 text-sm leading-none font-semibold">{title}</div>
    <div className="mb-1 font-mono text-[11px] text-slate-400 dark:text-slate-500">
      {info.from} - {info.to}
    </div>
    <div className="text-xs text-slate-600 dark:text-slate-400">
      {info.degree}
    </div>
  </div>
);

const CardItem: FC<TimelineListItemProps> = ({ title, info }) => (
  <Card
    className={clsx(
      'group relative mb-6 break-inside-avoid rounded-lg border border-slate-200 p-6 transition-all duration-200 bg-transparent shadow-none gap-3',
      'last:mb-0',
      // Hover effects
      'hover:shadow-theme-600/10 hover:scale-[1.01] hover:border-slate-300 hover:shadow-lg',
      // Print styles
      'print:mb-3 print:border-none print:p-0 print:shadow-none',
      // Dark mode
      'dark:border-white/5 dark:bg-slate-800/30 dark:backdrop-blur-sm dark:hover:border-white/10'
    )}
  >
    {/* Header Section */}
    <CardHeader
      className={clsx(
        'p-0 mb-0 flex flex-col gap-2',
        'print:mb-1 print:flex-row print:items-baseline print:justify-between print:gap-1',
        'sm:flex-row sm:items-baseline sm:justify-between'
      )}
    >
      <div className="flex flex-col gap-1 print:gap-0">
        <CardTitle
          className={clsx(
            'text-xl leading-tight font-bold tracking-tight text-slate-800',
            'print:text-sm print:font-bold',
            'dark:text-slate-100'
          )}
        >
          {title}
        </CardTitle>
        {info.position && (
          <div
            className={clsx(
              'text-theme-600 text-base font-semibold',
              'print:text-xs print:font-semibold',
              'dark:text-theme-400'
            )}
          >
            {info.position}
          </div>
        )}
      </div>
      <Badge
        variant="secondary"
        className={clsx(
          'shrink-0 font-mono text-xs whitespace-nowrap text-slate-500 rounded px-2 py-0.5 font-normal',
          'print:self-start print:bg-transparent print:p-0 print:text-[10px] print:font-medium print:text-slate-500 print:border-0',
          'dark:bg-slate-700 dark:text-slate-400'
        )}
      >
        {info.from} — {info.to}
      </Badge>
    </CardHeader>

    {/* Meta Info (Location/Degree) */}
    <div
      className={clsx(
        'flex items-center gap-2 font-mono text-xs text-slate-500',
        'print:mb-1 print:text-[10px]',
        'dark:text-slate-400'
      )}
    >
      <span>{info.location}</span>
      {info.degree && (
        <>
          <span className="h-1 w-1 rounded-full bg-slate-300 print:bg-slate-400"></span>
          <span>{info.degree}</span>
        </>
      )}
    </div>

    {/* Content List */}
    <CardContent
      className={clsx(
        'p-0 space-y-2 text-[13px] leading-relaxed text-slate-700',
        'print:space-y-0.5 print:text-[10px] print:leading-normal',
        'dark:text-slate-300'
      )}
    >
      {info.content?.map((item, i) => (
        <InfoContent
          key={i}
          title={item.title}
          url={item.url}
          details={item.details}
        />
      ))}
    </CardContent>
  </Card>
);

const TimelineListItem: FC<TimelineListItemProps> = (props) => {
  if (props.compact) {
    return <CompactItem {...props} />;
  }
  return <CardItem {...props} />;
};

export default TimelineListItem;
