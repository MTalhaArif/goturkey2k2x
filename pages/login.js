import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function Login() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const profileSnap = await getDoc(doc(db, 'users', cred.user.uid));
      const role = profileSnap.exists() ? profileSnap.data().role : 'student';

      router.push(role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      console.error(err);
      setError(t('login.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t('login.metaTitle')}</title>
      </Head>
      <div className="section section-bg" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '400px' }}>
          <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--secondary)' }}>{t('login.title')}</h2>

            {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="form-label">{t('login.email')}</label>
                <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="form-group mb-8" style={{ position: 'relative' }}>
                <label className="form-label">{t('login.password')}</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input type={showPassword ? "text" : "password"} className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', insetInlineEnd: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                    {showPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>
              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', padding: '12px' }}>
                {loading ? t('login.authenticating') : t('login.signIn')}
              </button>
            </form>

            <div className="text-center mt-4">
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {t('login.noApplication')}<Link href="/register" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{t('login.applyNow')}</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
