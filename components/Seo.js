import Head from 'next/head';
import { useRouter } from 'next/router';
import { SITE_DOMAIN, SITE_LOCALES, localizedUrl } from '@/lib/seo';

export default function Seo({ title, description, path, noindex = false }) {
  const router = useRouter();
  const locale = router.locale || 'en';
  const canonicalUrl = localizedUrl(locale, path);
  const ogImage = `${SITE_DOMAIN}/og-image.png`;

  return (
    <Head>
      <title>{title}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={canonicalUrl} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {SITE_LOCALES.map((l) => (
        <link key={l} rel="alternate" hrefLang={l} href={localizedUrl(l, path)} />
      ))}
      <link rel="alternate" hrefLang="x-default" href={`${SITE_DOMAIN}${path}`} />
      <meta property="og:title" content={title} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="GoTurkey 2k2x" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      {description && <meta name="twitter:description" content={description} />}
      <meta name="twitter:image" content={ogImage} />
    </Head>
  );
}
