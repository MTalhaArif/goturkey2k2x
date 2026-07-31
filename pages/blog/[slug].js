import Head from 'next/head';
import Link from 'next/link';
import { travelBlogPosts } from '@/lib/travelBlog';
import Seo from '@/components/Seo';
import Reveal from '@/components/Reveal';
import { useTranslation } from '@/lib/i18n/useTranslation';

export async function getStaticPaths({ locales }) {
  const paths = travelBlogPosts.flatMap((post) =>
    locales.map((locale) => ({ params: { slug: post.slug }, locale }))
  );
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const post = travelBlogPosts.find((p) => p.slug === params.slug);
  if (!post) return { notFound: true };
  const related = travelBlogPosts.filter((p) => p.slug !== post.slug).slice(0, 3);
  return { props: { post, related } };
}

export default function BlogPost({ post, related }) {
  const { t } = useTranslation();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    articleBody: post.body.join(' '),
    publisher: { '@type': 'Organization', name: 'GoTurkey 2k2x' },
  };

  return (
    <>
      <Seo title={`${post.title} | GoTurkey 2k2x`} description={post.excerpt} path={`/blog/${post.slug}`} />
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      </Head>

      <div className="section section-bg">
        <div className="container" style={{ maxWidth: '760px' }}>
          <nav style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            <Link href="/" style={{ color: 'var(--text-muted)' }}>{t('universityDetail.breadcrumbHome')}</Link>
            {' / '}
            <Link href="/blog" style={{ color: 'var(--text-muted)' }}>{t('blog.title')}</Link>
            {' / '}
            <span style={{ color: 'var(--secondary)' }}>{post.title}</span>
          </nav>

          <Reveal>
            <h1 style={{ color: 'var(--secondary)', fontSize: '2.2rem', marginBottom: '1.5rem' }}>{post.title}</h1>
          </Reveal>

          <Reveal delay={80}>
            {post.body.map((paragraph, i) => (
              <p key={i} style={{ color: 'var(--text-main)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '1.25rem' }}>
                {paragraph}
              </p>
            ))}
          </Reveal>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '3rem' }}>
            {t('tourism.attribution')}
          </p>

          <div className="card text-center" style={{ marginBottom: '3rem', borderTop: '4px solid var(--primary)' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>{t('blog.ctaTitle')}</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>{t('blog.ctaSubtext')}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/universities" className="btn-primary">{t('tourism.ctaBrowseUniversities')}</Link>
              <Link href="/register" className="btn-secondary">{t('tourism.ctaApplyNow')}</Link>
            </div>
          </div>

          {related.length > 0 && (
            <>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--secondary)', marginBottom: '1rem' }}>{t('blog.relatedTitle')}</h2>
              <div className="grid-3" style={{ marginBottom: '2rem' }}>
                {related.map((p) => (
                  <Link key={p.slug} href={`/blog/${p.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    <div className="card">
                      <h3 className="card-title" style={{ fontSize: '1rem' }}>{p.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          <Link href="/blog" style={{ color: 'var(--primary)', fontWeight: 700 }}>{t('blog.backToBlog')}</Link>
        </div>
      </div>
    </>
  );
}
