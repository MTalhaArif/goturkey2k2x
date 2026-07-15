import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from '@/lib/i18n/useTranslation';
import { locales } from '@/lib/i18n/locales';

export default function LanguageSwitcher({ className = '' }) {
  const router = useRouter();
  const { locale, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const switchTo = (nextLocale) => {
    const { pathname, asPath, query } = router;
    router.push({ pathname, query }, asPath, { locale: nextLocale });
    setOpen(false);
  };

  return (
    <div className={`lang-switcher ${className}`} ref={ref}>
      <button
        type="button"
        className="lang-switcher-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label={t('languageSwitcher.ariaLabel')}
        aria-expanded={open}
      >
        {locales[locale].common.languageName}
        <span className="lang-switcher-caret">▾</span>
      </button>
      {open && (
        <div className="lang-switcher-menu">
          {Object.keys(locales).map((code) => (
            <button
              type="button"
              key={code}
              className={`lang-switcher-item${code === locale ? ' lang-switcher-item-active' : ''}`}
              onClick={() => switchTo(code)}
            >
              {locales[code].common.languageName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
