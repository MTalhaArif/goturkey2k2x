import Link from 'next/link';
import { travelBlogPosts } from '@/lib/travelBlog';
import Reveal from '@/components/Reveal';
import Seo from '@/components/Seo';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function Blog() {
  const { t } = useTranslation();

  return (
    <>
      <Seo title={t('blog.metaTitle')} description={t('blog.metaDescription')} path="/blog" />

      <div className="section section-bg">
        <div className="container">
          <Reveal className="section-header">
            <h1>{t('blog.title')}</h1>
            <p>{t('blog.subtitle')}</p>
          </Reveal>

          <div className="grid-3">
            {travelBlogPosts.map((post, i) => (
              <Reveal key={post.slug} delay={(i % 3) * 90}>
                <Link href={`/blog/${post.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.5rem' }}>
                      {post.category === 'guide' ? t('blog.categoryGuide') : t('blog.categoryTravel')}
                    </span>
                    <h3 className="card-title">{post.title}</h3>
                    <p className="card-text" style={{ flex: 1 }}>{post.excerpt}</p>
                    <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem', marginTop: '1rem' }}>{t('blog.readMore')} →</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>

          <p className="text-center mt-4" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {t('tourism.attribution')}
          </p>
        </div>
      </div>
    </>
  );
}
