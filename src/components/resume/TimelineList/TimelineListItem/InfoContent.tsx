'use client';
import { FC } from 'react';
import type { Content } from '@/types/resume';
import { trackEvent } from '@/lib/analytics';

const onInfoLinkClick = (url: string, label?: string) => {
  trackEvent('outbound_click', { source: 'info', url, label });
};

const InfoContent: FC<Content> = ({ title, url, details }) => {
  const handleClick = (url: string, label?: string) => {
    if (url) onInfoLinkClick(url, label);
  };
  return (
    <>
      {title && <InfoTitle title={title} url={url} />}
      <ul>
        {details?.map((detail, i) => {
          const detailUrl = detail.url;
          return (
            <li key={i} className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-[0.5em] size-1.5 shrink-0 rounded-full bg-slate-400 dark:bg-slate-500"
              />
              <div className="min-w-0 flex-1">
                {detailUrl ? (
                  <a
                    href={detailUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => handleClick(detailUrl, detail.title)}
                    className="text-primary-600 dark:text-primary-400 opacity-80 print:opacity-100"
                  >
                    {detail.title}
                  </a>
                ) : (
                  <span className="opacity-80 print:opacity-100">
                    {detail.title}
                  </span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
};

interface InfoTitleProps {
  title: string;
  url?: string;
}
const InfoTitle: FC<InfoTitleProps> = ({ title, url }) => {
  const handleClick = () => onInfoLinkClick(url!, title);
  return url ? (
    <a
      className="no-underline"
      target="_blank"
      rel="noopener noreferrer"
      href={url}
      onClick={handleClick}
    >
      <div className="text-primary-600 dark:text-primary-400 m-0.5 font-medium">{title}</div>
    </a>
  ) : (
    <div className="m-0.5 font-medium">{title}</div>
  );
};

export default InfoContent;
