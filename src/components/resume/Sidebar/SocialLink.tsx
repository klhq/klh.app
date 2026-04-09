'use client';
import { FC } from 'react';
import { AiFillGithub, AiFillLinkedin, AiOutlineMail } from 'react-icons/ai';
import { IconType } from 'react-icons';
import type { SocialLinkType, SocialLink } from '@/types/resume';
import { trackEvent } from '@/lib/analytics';
import clsx from 'clsx';

const SOCIAL_LINK_ICON_MAP: Record<SocialLinkType, IconType> = {
  Email: AiOutlineMail,
  LinkedIn: AiFillLinkedin,
  GitHub: AiFillGithub,
} as const;

const onLinkClick = (linkType: SocialLinkType) => {
  trackEvent('social_link_click', { link_type: linkType });
};

const formatDisplayLink = (link: string, name: SocialLinkType) => {
  if (name === 'Email') return link;
  return link.replace(/^https?:\/\/(www\.)?/, '');
};

interface SocialLinkProps {
  socialLink: SocialLink;
  printEmail?: string;
}
const SocialLinkComponent: FC<SocialLinkProps> = ({ socialLink, printEmail }) => {
  const Icon = SOCIAL_LINK_ICON_MAP[socialLink.name];
  const isPrintEmailOverride = socialLink.name === 'Email' && printEmail;
  return (
    <a
      key={socialLink.name}
      className={clsx(
        'group flex items-center gap-3 text-slate-600 no-underline transition-all duration-200',
        'hover:text-theme-600',
        'print:text-theme-600',
        'dark:hover:text-theme-400 dark:text-slate-400'
      )}
      href={
        socialLink.name === 'Email'
          ? `mailto:${socialLink.link}`
          : socialLink.link
      }
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onLinkClick(socialLink.name)}
    >
      <div
        className={clsx(
          'rounded-full border border-transparent bg-slate-100 p-2 transition-all duration-200',
          // Hover effects
          'group-hover:bg-theme-600/10 group-hover:scale-110',
          // Print styles
          'print:border print:border-slate-100 print:bg-slate-50 print:p-1',
          // Dark mode
          'dark:group-hover:bg-theme-400/20 dark:border-slate-700 dark:bg-slate-800/50'
        )}
      >
        <Icon className="size-5 print:size-3" />
      </div>
      <div className="text-sm break-all print:text-[10px] print:leading-tight">
        <span className="print:hidden">
          {socialLink.name === 'Email' ? socialLink.link : socialLink.name}
        </span>
        <span className="hidden print:inline">
          {isPrintEmailOverride
            ? printEmail
            : formatDisplayLink(socialLink.link, socialLink.name)}
        </span>
      </div>
    </a>
  );
};

export default SocialLinkComponent;
