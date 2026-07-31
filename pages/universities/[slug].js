import Head from 'next/head';
import Link from 'next/link';
import { universities } from '@/lib/universities';
import { slugifyUniversityName, getUniversityBySlug } from '@/lib/universitySlug';
import Seo from '@/components/Seo';
import Reveal from '@/components/Reveal';
import { useTranslation } from '@/lib/i18n/useTranslation';

export async function getStaticPaths({ locales }) {
  const paths = universities.flatMap((u) =>
    locales.map((locale) => ({ params: { slug: slugifyUniversityName(u.name) }, locale }))
  );
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const university = getUniversityBySlug(universities, params.slug);
  if (!university) return { notFound: true };
  return { props: { university } };
}

export default function UniversityDetail({ university }) {
  const { t } = useTranslation();
  const isState = university.type === 'State';
  const slug = slugifyUniversityName(university.name);
  const whyPrefix = isState ? 'whyState' : 'whyFoundation';

  const title = t('universityDetail.metaTitle', { name: university.name });
  const description = t('universityDetail.metaDescription', {
    name: university.name,
    city: university.city,
    count: university.programs.length,
    programs: university.programs.slice(0, 3).join(', '),
  });

  const related = universities.filter((u) => u.id !== university.id && u.city === university.city).slice(0, 3);

  const collegeJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollegeOrUniversity',
    name: university.name,
    address: { '@type': 'PostalAddress', addressLocality: university.city, addressCountry: 'TR' },
    ...(university.website && { url: `https://${university.website.replace(/^https?:\/\//, '')}` }),
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [1, 2, 3].map((i) => ({
      '@type': 'Question',
      name: t(`universityDetail.faq${i}Q`, { name: university.name }),
      acceptedAnswer: { '@type': 'Answer', text: t(`universityDetail.faq${i}A`, { name: university.name }) },
    })),
  };

  return (
    <>
      <Seo title={title} description={description} path={`/universities/${slug}`} />
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collegeJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      </Head>

      <div className="section section-bg">
        <div className="container" style={{ maxWidth: '900px' }}>
          <nav style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            <Link href="/" style={{ color: 'var(--text-muted)' }}>{t('universityDetail.breadcrumbHome')}</Link>
            {' / '}
            <Link href="/universities" style={{ color: 'var(--text-muted)' }}>{t('universityDetail.breadcrumbUniversities')}</Link>
            {' / '}
            <span style={{ color: 'var(--secondary)' }}>{university.name}</span>
          </nav>

          <Reveal>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <h1 style={{ color: 'var(--secondary)', fontSize: '2.2rem' }}>{university.name}</h1>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', padding: '6px 12px', border: '1px solid var(--primary)', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                {isState ? t('universityDetail.typeState') : t('universityDetail.typeFoundation')}
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '1.05rem', lineHeight: 1.7 }}>
              {isState
                ? t('universityDetail.introState', { name: university.name, city: university.city, count: university.programs.length })
                : t('universityDetail.introFoundation', { name: university.name, city: university.city, count: university.programs.length })}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>{t('universityDetail.whyTitle', { name: university.name })}</h2>
            <div className="grid-3" style={{ marginBottom: '2.5rem' }}>
              {[1, 2, 3].map((i) => (
                <div className="card" key={i}>
                  <h3 className="card-title" style={{ fontSize: '1.05rem' }}>{t(`universityDetail.${whyPrefix}${i}Title`)}</h3>
                  <p className="card-text">{t(`universityDetail.${whyPrefix}${i}Desc`, { name: university.name })}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>{t('universityDetail.programsTitle', { name: university.name })}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
              {university.programs.map((program) => (
                <span key={program} style={{ background: 'var(--bg-color)', padding: '8px 12px', borderRadius: '6px', fontSize: '0.9rem', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                  {program}
                </span>
              ))}
            </div>

            {university.website && (
              <p style={{ marginBottom: '2.5rem' }}>
                <strong>{t('universityDetail.websiteLabel')}: </strong>
                <a href={`https://${university.website.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>
                  {university.website} ↗
                </a>
              </p>
            )}
          </Reveal>

          <Reveal delay={160}>
            <div className="card text-center" style={{ marginBottom: '2.5rem', borderTop: '4px solid var(--primary)' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{t('universityDetail.applyCta', { name: university.name })}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{t('universityDetail.applySubtext')}</p>
              <Link href="/register" className="btn-primary">{t('universityDetail.applyCta', { name: university.name })}</Link>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <h2 style={{ fontSize: '1.5rem', color: 'var(--secondary)', marginBottom: '1rem' }}>{t('universityDetail.faqTitle')}</h2>
            <div style={{ marginBottom: '2.5rem' }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', color: 'var(--secondary)', marginBottom: '0.4rem' }}>{t(`universityDetail.faq${i}Q`, { name: university.name })}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{t(`universityDetail.faq${i}A`, { name: university.name })}</p>
                </div>
              ))}
            </div>
          </Reveal>

          {related.length > 0 && (
            <Reveal delay={240}>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--secondary)', marginBottom: '1rem' }}>{t('universityDetail.relatedTitle', { city: university.city })}</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2rem' }}>
                {related.map((u) => (
                  <Link key={u.id} href={`/universities/${slugifyUniversityName(u.name)}`} style={{ padding: '10px 16px', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--secondary)', fontWeight: 600, fontSize: '0.9rem' }}>
                    {u.name}
                  </Link>
                ))}
              </div>
            </Reveal>
          )}

          <Link href="/universities" style={{ color: 'var(--primary)', fontWeight: 700 }}>{t('universityDetail.backToList')}</Link>
        </div>
      </div>
    </>
  );
}
