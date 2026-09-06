// Generates public/sitemap.xml before every build.
//
// Static routes (home, hubs, all 15 verticals) are always included. Dynamic
// detail pages (individual approved jobs/gigs/listings) are added on a
// best-effort basis by calling the live API — if the API is unreachable
// (e.g. building locally before the backend is deployed, or offline), the
// script logs a warning and falls back to the static routes only rather
// than failing the build.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SITE_URL = 'https://www.liveinaus.com.au';
const API_URL = process.env.SITEMAP_API_URL || `${SITE_URL}/api`;

const VERTICAL_SLUGS = [
  'accommodation',
  'education',
  'migration',
  'real-estate',
  'cars-transport',
  'banking-finance',
  'insurance',
  'utilities',
  'healthcare',
  'family-community',
  'legal-tax',
  'marketplace',
  'food-lifestyle',
  'travel',
  'media',
  'blog-news'
];

const STATIC_ROUTES = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/jobs', changefreq: 'daily', priority: '0.9' },
  { path: '/freelance', changefreq: 'daily', priority: '0.9' },
  { path: '/platform', changefreq: 'weekly', priority: '0.8' },
  { path: '/login', changefreq: 'monthly', priority: '0.3' },
  { path: '/signup', changefreq: 'monthly', priority: '0.5' },
  ...VERTICAL_SLUGS.map((slug) => ({ path: `/platform/${slug}`, changefreq: 'daily', priority: '0.7' }))
];

async function fetchJson(path) {
  const response = await fetch(`${API_URL}${path}`, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`${path} responded ${response.status}`);
  return response.json();
}

async function collectDynamicRoutes() {
  const routes = [];

  const [jobs, gigs, listings] = await Promise.allSettled([
    fetchJson('/jobs'),
    fetchJson('/gigs'),
    fetchJson('/listings')
  ]);

  if (jobs.status === 'fulfilled') {
    for (const job of jobs.value) {
      if (job?._id) routes.push({ path: `/jobs/${job._id}`, changefreq: 'weekly', priority: '0.6' });
    }
  } else {
    console.warn('[sitemap] Skipping job listings —', jobs.reason?.message || jobs.reason);
  }

  if (gigs.status === 'fulfilled') {
    for (const gig of gigs.value) {
      if (gig?._id) routes.push({ path: `/freelance/${gig._id}`, changefreq: 'weekly', priority: '0.6' });
    }
  } else {
    console.warn('[sitemap] Skipping freelance gigs —', gigs.reason?.message || gigs.reason);
  }

  if (listings.status === 'fulfilled') {
    for (const listing of listings.value) {
      if (listing?._id && listing?.vertical) {
        routes.push({ path: `/platform/${listing.vertical}/${listing._id}`, changefreq: 'weekly', priority: '0.6' });
      }
    }
  } else {
    console.warn('[sitemap] Skipping platform listings —', listings.reason?.message || listings.reason);
  }

  return routes;
}

function buildXml(routes) {
  const today = new Date().toISOString().slice(0, 10);
  const urls = routes
    .map(
      ({ path, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

async function main() {
  let dynamicRoutes = [];
  try {
    dynamicRoutes = await collectDynamicRoutes();
  } catch (error) {
    console.warn('[sitemap] Could not reach the API, generating static routes only —', error.message);
  }

  const xml = buildXml([...STATIC_ROUTES, ...dynamicRoutes]);
  const outPath = join(__dirname, '..', 'public', 'sitemap.xml');
  writeFileSync(outPath, xml, 'utf8');
  console.log(`[sitemap] Wrote ${STATIC_ROUTES.length + dynamicRoutes.length} URLs to ${outPath}`);
}

main();
