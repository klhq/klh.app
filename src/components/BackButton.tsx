import { FC } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
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
    <Link
      href={href}
      className={clsx(
        'glass-button group fixed top-4 left-4 z-50 print:hidden',
        className
      )}
      title={title}
      aria-label={title}
    >
      <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
    </Link>
  );
};

export default BackButton;
