import { FC } from 'react';
import Link from 'next/link';
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
      <span className="transition-transform duration-200 group-hover:-translate-x-0.5">
        ←
      </span>
    </Link>
  );
};

export default BackButton;
