'use client';

import { FC } from 'react';
import { Printer } from 'lucide-react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@/components/ui/tooltip';
import { trackEvent } from '@/lib/analytics';
import Button from './Button';

const relock = () => {
  document.documentElement.classList.add('print:hidden');
  window.removeEventListener('afterprint', relock);
};

const PrintButton: FC = () => {
  const handlePrint = () => {
    trackEvent('resume_print');
    document.documentElement.classList.remove('print:hidden');

    window.addEventListener('afterprint', relock);
    window.print();
  };

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            onClick={handlePrint}
            aria-label="Print Resume"
          />
        }
      >
        <Printer className="size-6 transition-transform duration-300 group-hover:scale-110 group-active:scale-90" />
      </TooltipTrigger>
      <TooltipContent side="left">Print Resume</TooltipContent>
    </Tooltip>
  );
};

export default PrintButton;
