import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import { SITE_DOMAIN } from '@/lib/seo';

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'GoTurkey 2k2x',
  url: SITE_DOMAIN,
  logo: `${SITE_DOMAIN}/icon-512.png`,
  description:
    'GoTurkey 2k2x is an educational consultancy connecting international students with guaranteed acceptance at top Turkish universities, plus comprehensive post-landing services.',
  email: 'goturkeyandstudytr@gmail.com',
  telephone: '+905376994302',
  sameAs: [
    'https://www.instagram.com/goturkey2k2x',
    'https://whatsapp.com/channel/0029VbDH6rm0wajxEpZrUB0b',
  ],
};

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
      </Head>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
