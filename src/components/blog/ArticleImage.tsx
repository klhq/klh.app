'use client';

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ImgHTMLAttributes,
} from 'react';
import { createPortal } from 'react-dom';

type ArticleImageProps = Omit<
  ImgHTMLAttributes<HTMLImageElement>,
  'src' | 'alt'
> & {
  src: string;
  alt: string;
  zoomable?: boolean;
};

export default function ArticleImage({
  src,
  alt,
  zoomable = true,
  ...props
}: ArticleImageProps) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const modal = dialog.current;
    modal?.showModal();
    close.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      modal?.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const image = (
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} src={src} alt={alt} loading={props.loading ?? 'lazy'} />
  );
  if (!zoomable) return image;
  return (
    <>
      <button
        ref={trigger}
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge image: ${alt || 'Article image'}`}
        aria-haspopup="dialog"
        title="Enlarge image"
        className="focus-visible:outline-theme-500 inline-block max-w-full cursor-zoom-in rounded-lg border-0 bg-transparent p-0 text-left focus-visible:outline-2 focus-visible:outline-offset-4"
      >
        {image}
      </button>
      {open &&
        createPortal(
          <dialog
            ref={dialog}
            aria-labelledby={titleId}
            onClose={() => {
              setOpen(false);
              trigger.current?.focus();
            }}
            onClick={(event) => {
              if (event.target === event.currentTarget) dialog.current?.close();
            }}
            className="fixed inset-0 m-auto max-h-[100dvh] w-full max-w-6xl overflow-auto border-0 bg-transparent p-4 outline-none backdrop:bg-slate-950/85 sm:p-8"
          >
            <div className="relative rounded-xl bg-white p-4 shadow-2xl sm:p-6 dark:bg-slate-900">
              <h2 id={titleId} className="sr-only">
                {alt || 'Article image'}
              </h2>
              <button
                ref={close}
                type="button"
                aria-label="Close image preview"
                onClick={() => dialog.current?.close()}
                className="focus-visible:outline-theme-500 absolute top-2 right-2 z-10 flex size-10 items-center justify-center rounded-full bg-white/90 text-xl text-slate-700 shadow-sm hover:bg-slate-100 focus-visible:outline-2 dark:bg-slate-800/90 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                ×
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="mx-auto max-h-[80dvh] max-w-full object-contain"
              />
              {alt && (
                <p className="mt-3 text-center text-sm text-slate-500 dark:text-slate-400">
                  {alt}
                </p>
              )}
            </div>
          </dialog>,
          document.body
        )}
    </>
  );
}
