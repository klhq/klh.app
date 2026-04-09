'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

const SCROLL_THRESHOLDS = [25, 50, 75, 100];
const TIME_THRESHOLDS = [15, 30, 60, 180];

const EngagementTracker = () => {
  useEffect(() => {
    const firedScrollDepths = new Set<number>();
    const firedTimeThresholds = new Set<number>();
    const startTime = Date.now();

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const percent = Math.round((scrollTop / docHeight) * 100);

      for (const threshold of SCROLL_THRESHOLDS) {
        if (percent >= threshold && !firedScrollDepths.has(threshold)) {
          firedScrollDepths.add(threshold);
          trackEvent('scroll_depth', { percent: threshold });
        }
      }
    };

    const timeInterval = setInterval(() => {
      const elapsed = Math.round((Date.now() - startTime) / 1000);

      for (const threshold of TIME_THRESHOLDS) {
        if (elapsed >= threshold && !firedTimeThresholds.has(threshold)) {
          firedTimeThresholds.add(threshold);
          trackEvent('time_on_page', { seconds: threshold });
        }
      }

      if (firedTimeThresholds.size === TIME_THRESHOLDS.length) {
        clearInterval(timeInterval);
      }
    }, 5000);

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timeInterval);
    };
  }, []);

  return null;
};

export default EngagementTracker;
