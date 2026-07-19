import dynamic from 'next/dynamic';
import Link from 'next/link';
import { destinations } from '@/lib/destinations';
import { travelBlogPosts } from '@/lib/travelBlog';
import Reveal from '@/components/Reveal';
import Seo from '@/components/Seo';
import { useTranslation } from '@/lib/i18n/useTranslation';

const DestinationsMap = dynamic(() => import('@/components/DestinationsMap'), { ssr: false });

export default function Tourism() {
  const { t } = useTranslation();

  return (
    <>
      <Seo title={t('tourism.metaTitle')} description={t('tourism.metaDescription')} path="/tourism" />

      <div className="section section-bg">
        <div className="container">
          <Reveal className="section-header">
            <h2>{t('tourism.title')}</h2>
            <p>{t('tourism.subtitle')}</p>
          </Reveal>

          {/* MAP */}
          <Reveal delay={100} style={{ marginBottom: '4rem' }}>
            <DestinationsMap />
          </Reveal>

          {/* TOUR PACKAGES */}
          <div className="section-header" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem' }}>{t('tourism.packagesTitle')}</h2>
            <p>{t('tourism.packagesSubtitle')}</p>
          </div>
          <div className="grid-3" style={{ marginBottom: '5rem' }}>
            {[
              { key: 'package1', price: 500, duration: null, items: ['package1Item1', 'package1Item2', 'package1Item3', 'package1Item4', 'package1Item5'] },
              { key: 'package2', price: 700, duration: 'package2Duration', items: ['package2Item1', 'package2Item2', 'package2Item3', 'package2Item4', 'package2Item5'] },
              { key: 'package3', price: 800, duration: null, items: ['package3Item1', 'package3Item2'] },
              { key: 'package4', price: 800, duration: null, items: ['package4Item1', 'package4Item2', 'package4Item3', 'package4Item4'] },
            ].map((pkg, i) => (
              <Reveal key={pkg.key} delay={(i % 3) * 90}>
                <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h3 className="card-title" style={{ margin: 0 }}>{t(`tourism.${pkg.key}Title`)}</h3>
                    {pkg.duration && (
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                        {t(`tourism.${pkg.duration}`)}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-muted)' }}>{t('tourism.packagesFrom')} </span>
                    ${pkg.price}
                  </div>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', flex: 1 }}>
                    {pkg.items.map((itemKey) => (
                      <li key={itemKey} style={{ fontSize: '0.9rem', color: 'var(--text-main)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>✓</span>
                        {t(`tourism.${itemKey}`)}
                      </li>
                    ))}
                  </ul>
                  <a href="https://wa.me/905376994302" target="_blank" rel="noreferrer" className="btn-secondary text-center" style={{ marginTop: 'auto' }}>
                    {t('tourism.packagesInquire')}
                  </a>
                </div>
              </Reveal>
            ))}
          </div>

          {/* DESTINATIONS */}
          <div className="section-header" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem' }}>{t('tourism.topDestinations')}</h2>
          </div>
          <div className="grid-3" style={{ marginBottom: '5rem' }}>
            {destinations.map((dest, i) => (
              <Reveal key={dest.name} delay={(i % 3) * 90}>
                <div className="card">
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{dest.region}</span>
                  <h3 className="card-title" style={{ marginTop: '0.5rem' }}>{dest.name}</h3>
                  <p className="card-text">{dest.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* BLOG */}
          <div className="section-header" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem' }}>{t('tourism.storiesTitle')}</h2>
            <p>{t('tourism.storiesSubtitle')}</p>
          </div>
          <div className="grid-3">
            {travelBlogPosts.map((post, i) => (
              <Reveal key={post.title} delay={(i % 3) * 90}>
                <div className="card">
                  <h3 className="card-title">{post.title}</h3>
                  <p className="card-text">{post.excerpt}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="text-center mt-4" style={{ marginTop: '3rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              {t('tourism.attribution')}
            </p>
            <a href="https://goturkiye.com/" target="_blank" rel="noreferrer" className="btn-secondary">{t('tourism.exploreMore')}</a>
          </div>
        </div>
      </div>

      <section className="section text-center" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #a01010 60%, var(--secondary) 100%)', color: 'white' }}>
        <div className="container">
          <h2 style={{ color: 'white', marginBottom: '1rem' }}>{t('tourism.ctaTitle')}</h2>
          <p className="mb-8" style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>{t('tourism.ctaSubtitle')}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/universities" className="btn-primary" style={{ background: 'white', color: 'var(--primary)' }}>{t('tourism.ctaBrowseUniversities')}</Link>
            <Link href="/register" className="btn-secondary" style={{ color: 'white', borderColor: 'white' }}>{t('tourism.ctaApplyNow')}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
