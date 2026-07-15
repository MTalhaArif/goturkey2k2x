import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: "white", fontFamily: "var(--font-heading)" }}>
                <span style={{ color: "var(--primary)" }}>GoTurkey</span>2k2x
              </div>
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>{t('footer.tagline')}</div>
            </div>
            <p className="footer-text">
              {t('footer.blurb')}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 7, marginBottom: 18 }}>
              <a href="tel:+905376994302" style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>📞 +90 537 699 43 02</a>
              <a href="mailto:goturkeyandstudytr@gmail.com" style={{ color: "rgba(255,255,255,0.7)", fontSize: 14 }}>✉ goturkeyandstudytr@gmail.com</a>
            </div>
          </div>

          <div className="footer-col">
            <h3>{t('footer.quickLinks')}</h3>
            <ul className="footer-links">
              <li><Link href="/">› {t('footer.home')}</Link></li>
              <li><Link href="/about">› {t('footer.about')}</Link></li>
              <li><Link href="/universities">› {t('footer.universities')}</Link></li>
              <li><Link href="/services">› {t('footer.services')}</Link></li>
              <li><Link href="/tourism">› {t('footer.tourism')}</Link></li>
              <li><Link href="/register">› {t('footer.applyNow')}</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h3>{t('footer.followUs')}</h3>
            <ul className="footer-links">
              <li><a href="https://www.instagram.com/goturkey2k2x" target="_blank" rel="noreferrer">› {t('footer.instagram')}</a></li>
              <li><a href="https://whatsapp.com/channel/0029VbDH6rm0wajxEpZrUB0b" target="_blank" rel="noreferrer">› {t('footer.whatsappChannel')}</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center" style={{ paddingTop: 28, borderTop: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.45)", fontSize: 13 }}>
          <p>{t('footer.rights', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
}
