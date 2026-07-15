import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useTranslation } from '@/lib/i18n/useTranslation';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { t } = useTranslation();

  // Decide if admin or student based on path
  const isAdmin = router.pathname.startsWith('/admin');

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: 'var(--secondary)', color: 'white', padding: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>
            <span style={{ color: 'var(--primary)' }}>GoTurkey</span>2k2x
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>|</span>
          <span style={{ fontSize: '1.1rem', fontWeight: '500' }}>{isAdmin ? t('dashboardLayout.adminPortal') : t('dashboardLayout.studentPortal')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <LanguageSwitcher />
          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', padding: '6px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
            {t('dashboardLayout.logout')}
          </button>
        </div>
      </header>

      <main style={{ flex: 1, padding: '2rem' }}>
        {children}
      </main>
    </div>
  );
}
