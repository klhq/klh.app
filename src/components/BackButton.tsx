import { FC } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import clsx from 'clsx';

interface BackButtonProps {
  href: string;
  title?: string;
  className?: string;
}

const BackButton: FC<BackButtonProps> = ({
  href,
  title = 'Back to home',
  className = '',
}) => {
  return (
    <div className={clsx('fixed top-4 left-4 z-50 print:hidden', className)}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Link
              href={href}
              className="glass-button group"
              aria-label={title}
            />
          }
        >
          <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
        </TooltipTrigger>
        <TooltipContent side="right">{title}</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default BackButton;
