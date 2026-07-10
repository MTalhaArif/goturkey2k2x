import dynamic from 'next/dynamic';
import Head from 'next/head';
import { destinations } from '@/lib/destinations';
import { travelBlogPosts } from '@/lib/travelBlog';
import Reveal from '@/components/Reveal';

const DestinationsMap = dynamic(() => import('@/components/DestinationsMap'), { ssr: false });

export default function Tourism() {
  return (
    <>
      <Head>
        <title>Tourism in Türkiye | GoTurkey 2k2x</title>
        <meta name="description" content="Discover Türkiye's top destinations, culture and travel stories while you plan your studies abroad." />
      </Head>

      <div className="section section-bg">
        <div className="container">
          <Reveal className="section-header">
            <h2>Discover Türkiye</h2>
            <p>Beyond your studies, Türkiye offers centuries of history, stunning coastlines, and unforgettable culture. Here&apos;s a taste of what&apos;s waiting for you.</p>
          </Reveal>

          {/* MAP */}
          <Reveal delay={100} style={{ marginBottom: '4rem' }}>
            <DestinationsMap />
          </Reveal>

          {/* DESTINATIONS */}
          <div className="section-header" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '2rem' }}>Top Destinations</h2>
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
            <h2 style={{ fontSize: '2rem' }}>Travel & Culture Stories</h2>
            <p>A few reads to get you excited about life in Türkiye.</p>
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
              Destination and travel content courtesy of the official Go Türkiye tourism board.
            </p>
            <a href="https://goturkiye.com/" target="_blank" rel="noreferrer" className="btn-secondary">Explore More on GoTürkiye.com</a>
          </div>
        </div>
      </div>
    </>
  );
}
