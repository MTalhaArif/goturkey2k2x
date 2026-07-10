import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/AuthContext';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);
  const router = useRouter();
  const { user, profile, loading } = useAuth();

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
                <span className="top-auth-link" style={{ opacity: 0.9 }}>Hi, {profile?.firstName || 'there'}</span>
                <Link href={dashboardHref} className="top-auth-link">Dashboard</Link>
                <button onClick={handleLogout} className="top-auth-link" style={{ background: 'none', border: 'none', cursor: 'pointer', font: 'inherit' }}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/register" className="top-auth-link">Register</Link>
                <Link href="/login" className="top-auth-link">Login</Link>
              </>
            )}
          </div>
        </div>
      </div>

      <header className="header">
        <div className="container">
          <Link href="/" className="logo">
            <div className="logo-text">
              <span className="logo-go">GoTurkey</span>
              <span className="logo-turkey">2k2x</span>
              <div className="logo-tagline">Beyond Borders, Building Futures</div>
            </div>
          </Link>

          <button className="mobile-menu-toggle" aria-label="Toggle menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
            <span></span>
            <span></span>
            <span></span>
          </button>

          <nav className={`nav-links${menuOpen ? ' nav-links-open' : ''}`}>
            <div className="nav-item">
              <Link href="/about" className="nav-link-btn" onClick={closeMenu}>About Us</Link>
            </div>
            <div className="nav-item">
              <Link href="/universities" className="nav-link-btn" onClick={closeMenu}>Universities</Link>
            </div>
            <div className="nav-item">
              <Link href="/services" className="nav-link-btn" onClick={closeMenu}>Our Services</Link>
            </div>
            <div className="nav-item">
              <Link href="/tourism" className="nav-link-btn" onClick={closeMenu}>Tourism</Link>
            </div>
            {user ? (
              <Link href={dashboardHref} className="nav-link-btn nav-tryos" onClick={closeMenu}>Dashboard</Link>
            ) : (
              <Link href="/register" className="nav-link-btn nav-tryos" onClick={closeMenu}>Apply Now</Link>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
