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
