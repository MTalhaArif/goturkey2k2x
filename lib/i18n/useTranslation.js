import { useRouter } from 'next/router';
import { locales } from './locales';

function getPath(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

export function useTranslation() {
  const router = useRouter();
  const locale = router.locale || router.defaultLocale || 'en';

  const t = (key, vars) => {
    let str = getPath(locales[locale], key);
    if (str === undefined) str = getPath(locales.en, key);
    if (str === undefined) str = key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      }
    }
    return str;
  };

  return { t, locale };
}
