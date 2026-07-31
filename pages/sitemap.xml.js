import { SITE_DOMAIN, SITE_LOCALES, localePrefix } from '@/lib/seo';
import { universities } from '@/lib/universities';
import { slugifyUniversityName } from '@/lib/universitySlug';
import { travelBlogPosts } from '@/lib/travelBlog';

const PUBLIC_PATHS = [
  '/', '/about', '/services', '/universities', '/tourism', '/blog', '/register', '/login', '/partners',
  ...universities.map((u) => `/universities/${slugifyUniversityName(u.name)}`),
  ...travelBlogPosts.map((p) => `/blog/${p.slug}`),
];

function buildSitemap() {
  const urlEntries = PUBLIC_PATHS.map((path) => {
    const alternates = SITE_LOCALES.map(
      (l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE_DOMAIN}${localePrefix(l)}${path}" />`
    ).join('');
    const xDefault = `<xhtml:link rel="alternate" hreflang="x-default" href="${SITE_DOMAIN}${path}" />`;

    return SITE_LOCALES.map((locale) => {
      const loc = `${SITE_DOMAIN}${localePrefix(locale)}${path}`;
      return `<url><loc>${loc}</loc>${alternates}${xDefault}</url>`;
    }).join('');
  }).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urlEntries}</urlset>`;
}

export async function getServerSideProps({ res }) {
  res.setHeader('Content-Type', 'text/xml');
  res.write(buildSitemap());
  res.end();
  return { props: {} };
}

export default function Sitemap() {
  return null;
}
