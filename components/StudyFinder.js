import { useMemo, useState } from 'react';
import Link from 'next/link';
import { universities } from '@/lib/universities';
import { filterUniversities } from '@/lib/universityFilters';
import Reveal from '@/components/Reveal';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function StudyFinder() {
  const { t } = useTranslation();
  const [term, setTerm] = useState('');
  const [privateOnly, setPrivateOnly] = useState(true);

  const results = useMemo(() => {
    if (!term.trim()) return [];
    return filterUniversities(universities, { term, privateOnly }).slice(0, 8);
  }, [term, privateOnly]);

  return (
    <section className="section" style={{ background: '#f8fafc' }}>
      <div className="container">
        <Reveal className="section-header">
          <h2>{t('studyFinder.title')}</h2>
          <p>{t('studyFinder.subtitle')}</p>
        </Reveal>

        <Reveal delay={100} as="div" style={{ maxWidth: '640px', margin: '0 auto' }}>
          <input
            type="text"
            className="form-input"
            placeholder={t('studyFinder.searchPlaceholder')}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            style={{ fontSize: '1.05rem', padding: '16px 20px' }}
          />

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <input type="checkbox" checked={privateOnly} onChange={(e) => setPrivateOnly(e.target.checked)} />
            {t('studyFinder.privateOnly')}
          </label>

          {term.trim() && (
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {results.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  {t('studyFinder.noResults')}
                </p>
              ) : (
                results.map((uni) => (
                  <div key={uni.id} className="card" style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h3 style={{ color: 'var(--secondary)', fontSize: '1.15rem' }}>{uni.name}</h3>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{uni.city}</span>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>· {uni.type}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
                      {uni.programs.slice(0, 8).map((program) => (
                        <span key={program} style={{ background: 'var(--bg-color)', padding: '6px 10px', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                          {program}
                        </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          <div className="text-center mt-4">
            <Link href="/universities" className="btn-secondary" style={{ marginInlineEnd: '1rem' }}>{t('studyFinder.browseAll')}</Link>
            <Link href="/register" className="btn-primary">{t('studyFinder.applyNow')}</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
