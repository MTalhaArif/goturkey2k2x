import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Reveal from '@/components/Reveal';
import Seo from '@/components/Seo';
import { useTranslation } from '@/lib/i18n/useTranslation';

const emptyForm = { name: '', agencyName: '', phone: '', email: '', location: '' };

export default function Partners() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await addDoc(collection(db, 'partnerLeads'), {
        ...formData,
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting partner application:', err);
      setError(t('partners.errorGeneric'));
    } finally {
      setSubmitting(false);
    }
  };

  const benefits = [
    { icon: '💰', title: t('partners.benefit1Title'), desc: t('partners.benefit1Desc') },
    { icon: '🤝', title: t('partners.benefit2Title'), desc: t('partners.benefit2Desc') },
    { icon: '⚡', title: t('partners.benefit3Title'), desc: t('partners.benefit3Desc') },
  ];

  return (
    <>
      <Seo title={t('partners.metaTitle')} description={t('partners.metaDescription')} path="/partners" />

      <section className="hero">
        <div className="hero-slides-wrap" style={{ background: 'linear-gradient(135deg, rgba(15, 26, 60, 0.9) 0%, rgba(227, 28, 37, 0.7) 100%), url(\'/hero.png\')', backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="hero-content" style={{ margin: 'auto', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white' }}>
            <h1 style={{ color: 'white' }}>{t('partners.heroTitle')}</h1>
            <p style={{ fontWeight: 500, color: 'white', maxWidth: '600px', textAlign: 'center' }}>{t('partners.heroSubtitle')}</p>
            <a href="#partner-form" className="btn-primary" style={{ backgroundColor: 'var(--accent)', color: 'var(--text-main)' }}>{t('partners.heroCta')}</a>
          </div>
        </div>
      </section>

      <div className="section section-bg">
        <div className="container">
          <div className="grid-3" style={{ marginBottom: '4rem' }}>
            {benefits.map((b, i) => (
              <Reveal key={b.title} delay={i * 90}>
                <div className="card text-center">
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{b.icon}</div>
                  <h3 className="card-title">{b.title}</h3>
                  <p className="card-text">{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal id="partner-form" style={{ maxWidth: '500px', margin: '0 auto', scrollMarginTop: '2rem' }}>
            <div style={{ background: 'white', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              {submitted ? (
                <div className="text-center">
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                  <h2 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>{t('partners.successTitle')}</h2>
                  <p style={{ color: 'var(--text-muted)' }}>{t('partners.successMessage')}</p>
                </div>
              ) : (
                <>
                  <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--secondary)' }}>{t('partners.formTitle')}</h2>
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>{t('partners.formSubtitle')}</p>

                  {error && <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}

                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label className="form-label">{t('partners.name')}</label>
                      <input type="text" className="form-input" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('partners.agencyName')}</label>
                      <input type="text" className="form-input" name="agencyName" value={formData.agencyName} onChange={handleChange} placeholder={t('partners.agencyNamePlaceholder')} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('partners.phone')}</label>
                      <input type="tel" className="form-input" name="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                      <label className="form-label">{t('partners.email')}</label>
                      <input type="email" className="form-input" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group mb-8">
                      <label className="form-label">{t('partners.location')}</label>
                      <input type="text" className="form-input" name="location" value={formData.location} onChange={handleChange} placeholder={t('partners.locationPlaceholder')} required />
                    </div>

                    <button type="submit" className="btn-primary" disabled={submitting} style={{ width: '100%', fontSize: '1.1rem', padding: '14px' }}>
                      {submitting ? t('partners.submitting') : t('partners.submit')}
                    </button>
                  </form>
                </>
              )}
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
