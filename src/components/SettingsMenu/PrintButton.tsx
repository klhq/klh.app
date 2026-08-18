'use client';

import { FC } from 'react';
import { Printer } from 'lucide-react';
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
    <Button
      onClick={handlePrint}
      title="Print Resume"
      aria-label="Print Resume"
    >
      <div className="transition-transform duration-300 group-hover:scale-110 group-active:scale-90">
        <Printer className="size-6" />
      </div>
    </Button>
  );
};

export default PrintButton;
