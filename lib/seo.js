export const SITE_DOMAIN = 'https://goturkey2k2x.com';
export const SITE_LOCALES = ['en', 'ar', 'tr'];

export function localePrefix(locale) {
  return locale === 'en' ? '' : `/${locale}`;
}

export function localizedUrl(locale, path) {
  return `${SITE_DOMAIN}${localePrefix(locale)}${path}`;
}
