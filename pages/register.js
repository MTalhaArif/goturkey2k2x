import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Seo from '@/components/Seo';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function Register() {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Pre-filled with dummy details as requested
  const [formData, setFormData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@example.com',
    password: 'password123',
    reference: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const now = new Date().toISOString();

      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        reference: formData.reference,
        role: 'student',
        status: 'active',
        dob: '',
        nationality: '',
        motherName: '',
        phone: '',
        documentationServices: [],
        documentationOther: '',
        accommodationTypes: [],
        createdAt: now,
        updatedAt: now,
      });

      router.push('/student/dashboard');
    } catch (err) {
      console.error('Error creating account:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError(t('register.errorExists'));
      } else if (err.code === 'auth/weak-password') {
        setError(t('register.errorWeakPassword'));
      } else {
        setError(t('register.errorGeneric'));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo title={t('register.metaTitle')} description={t('register.metaDescription')} path="/register" />
      <div className="section section-bg" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ maxWidth: '500px' }}>
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--secondary)' }}>{t('register.title')}</h2>
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>{t('register.subtitle')}</p>

            {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="responsive-2col" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">{t('register.firstName')}</label>
                  <input type="text" className="form-input" name="firstName" value={formData.firstName} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">{t('register.lastName')}</label>
                  <input type="text" className="form-input" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">{t('register.email')}</label>
                <input type="email" className="form-input" name="email" value={formData.email} onChange={handleInputChange} required />
              </div>
              <div className="form-group" style={{ position: 'relative' }}>
                <label className="form-label">{t('register.password')}</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <input type={showPassword ? "text" : "password"} className="form-input" name="password" value={formData.password} onChange={handleInputChange} required style={{ width: '100%' }} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', insetInlineEnd: '10px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                    {showPassword ? '👁️' : '🙈'}
                  </button>
                </div>
              </div>

              <div className="form-group mb-8">
                <label className="form-label">{t('register.reference')}</label>
                <input type="text" className="form-input" name="reference" value={formData.reference} onChange={handleInputChange} placeholder={t('register.referencePlaceholder')} />
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', fontSize: '1.1rem', padding: '14px' }}>
                {loading ? t('register.creating') : t('register.submit')}
              </button>
            </form>

            <div className="text-center mt-4">
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {t('register.haveAccount')}<Link href="/login" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{t('register.loginHere')}</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
