import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';
import { useTranslation } from '@/lib/i18n/useTranslation';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const { t } = useTranslation();

  const dashboardHref = profile?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';

  const handleLogout = async () => {
    closeMenu();
    await signOut(auth);
    router.push('/');
  };

  return (
    <>
      <div className="top-bar">
        <div className="container">
          <div className="top-contact">
            <a href="mailto:goturkeyandstudytr@gmail.com">
              ✉ goturkeyandstudytr@gmail.com
            </a>
            <a href="tel:+905376994302">
              📞 +90 537 699 43 02
            </a>
          </div>
          <div className="top-social">
            {loading ? null : user ? (
              <>
                <span className="top-auth-link" style={{ opacity: 0.9 }}>{t('header.hi', { name: profile?.firstName || t('header.there') })}</span>
                <Link href={dashboardHref} className="top-auth-link">{t('header.dashboard')}</Link>
                <button onClick={handleLogout} className="top-auth-link" style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>{t('header.logout')}</button>
              </>
            ) : (
              <>
                <Link href="/register" className="top-auth-link">{t('header.register')}</Link>
                <Link href="/login" className="top-auth-link">{t('header.login')}</Link>
              </>
            )}
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <header className="header">
        <div className="container">
          <Link href="/" className="logo">
            <div className="logo-text">
              <span className="logo-go">GoTurkey</span>
              <span className="logo-turkey">2k2x</span>
              <div className="logo-tagline">{t('header.tagline')}</div>
            </div>
          </Link>

          <button className="mobile-menu-toggle" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`nav-links${menuOpen ? ' nav-links-open' : ''}`}>
            <div className="nav-item">
              <Link href="/about" className="nav-link-btn" onClick={closeMenu}>{t('header.about')}</Link>
            </div>
            <div className="nav-item">
              <Link href="/universities" className="nav-link-btn" onClick={closeMenu}>{t('header.universities')}</Link>
            </div>
            <div className="nav-item">
              <Link href="/services" className="nav-link-btn" onClick={closeMenu}>{t('header.services')}</Link>
            </div>
            <div className="nav-item">
              <Link href="/tourism" className="nav-link-btn" onClick={closeMenu}>{t('header.tourism')}</Link>
            </div>
            <div className="nav-item">
              <Link href="/partners" className="nav-link-btn" onClick={closeMenu}>{t('header.partners')}</Link>
            </div>
            {user ? (
              <Link href={dashboardHref} className="nav-link-btn nav-tryos" onClick={closeMenu}>{t('header.dashboard')}</Link>
            ) : (
              <Link href="/register" className="nav-link-btn nav-tryos" onClick={closeMenu}>{t('header.applyNow')}</Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
