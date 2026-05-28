'use client';
import { FC } from 'react';
import type { Content } from '@/types/resume';
import { trackEvent } from '@/lib/analytics';
import { BsDot } from 'react-icons/bs';

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
            <li key={i} className="flex gap-0.5">
              <div className="flex h-6 w-4.5 justify-center pt-px">
                <BsDot size="18px" />
              </div>
              {detailUrl ? (
                <a
                  href={detailUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleClick(detailUrl, detail.title)}
                >
                  <div className="text-primary-600 dark:text-primary-400 opacity-80 print:opacity-100">
                    {detail.title}
                  </div>
                </a>
              ) : (
                <div className="opacity-80 print:opacity-100">
                  {detail.title}
                </div>
              )}
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
