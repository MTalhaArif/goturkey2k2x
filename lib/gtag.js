export const GA_MEASUREMENT_ID = 'G-1HJ785FZJG';

export function pageview(url) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('config', GA_MEASUREMENT_ID, { page_path: url });
}
