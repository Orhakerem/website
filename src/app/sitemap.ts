import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/app/seo';
import { getAllPosts, getAvailablePostLocales } from '@/lib/blog';
import { DEFAULT_LOCALE, ENABLED_LOCALES, localizePath } from '@/i18n/config';

type StaticRoute = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
  /**
   * Real date the page last changed (ISO `YYYY-MM-DD`). Previously every URL
   * reported `new Date()`, so the whole sitemap claimed to change on every
   * build — a signal Google discounts. Bump the date when you edit the page.
   */
  lastModified: string;
};

const staticRoutes: StaticRoute[] = [
  { path: '/', changeFrequency: 'daily', priority: 1.0, lastModified: '2026-07-19' },
  { path: '/properties', changeFrequency: 'daily', priority: 0.9, lastModified: '2026-08-10' },
  { path: '/properties/penthouse-jacuzzi', changeFrequency: 'weekly', priority: 0.9, lastModified: '2026-08-10' },
  { path: '/properties/cozy-studio', changeFrequency: 'weekly', priority: 0.9, lastModified: '2026-08-10' },
  { path: '/reservation', changeFrequency: 'weekly', priority: 0.8, lastModified: '2026-08-10' },
  { path: '/services', changeFrequency: 'weekly', priority: 0.8, lastModified: '2026-08-10' },
  { path: '/events', changeFrequency: 'weekly', priority: 0.7, lastModified: '2026-11-22' },
  { path: '/about', changeFrequency: 'weekly', priority: 0.7, lastModified: '2026-07-19' },
  { path: '/faq', changeFrequency: 'monthly', priority: 0.6, lastModified: '2026-07-06' },
  { path: '/contact', changeFrequency: 'monthly', priority: 0.6, lastModified: '2026-08-10' },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3, lastModified: '2026-07-19' },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3, lastModified: '2026-07-26' },
  { path: '/cancellation', changeFrequency: 'yearly', priority: 0.3, lastModified: '2026-07-07' },
];

function languagesFor(path: string, locales: readonly (typeof ENABLED_LOCALES)[number][] = ENABLED_LOCALES) {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale] = `${SITE_URL}${localizePath(locale, path)}`;
  }
  languages['x-default'] = `${SITE_URL}${localizePath(DEFAULT_LOCALE, path)}`;
  return languages;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const localizedStaticEntries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    ENABLED_LOCALES.map((locale) => ({
      url: `${SITE_URL}${localizePath(locale, route.path)}`,
      lastModified: new Date(route.lastModified),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: languagesFor(route.path),
      },
    })),
  );

  const posts = getAllPosts('en');
  // The blog index changes when its newest post does — not on every build.
  const blogIndexLastModified = posts.reduce((latest, post) => {
    const posted = new Date(post.frontmatter.updated ?? post.frontmatter.date);
    return posted > latest ? posted : latest;
  }, new Date(0));
  const blogIndexEntries: MetadataRoute.Sitemap = ENABLED_LOCALES.map((locale) => ({
    url: `${SITE_URL}${localizePath(locale, '/blog')}`,
    lastModified: blogIndexLastModified,
    changeFrequency: 'daily',
    priority: 0.8,
    alternates: { languages: languagesFor('/blog') },
  }));
  const blogPostEntries: MetadataRoute.Sitemap = posts.flatMap((post) => {
    const availableLocales = getAvailablePostLocales(post.slug);

    return availableLocales.map((locale) => ({
      url: `${SITE_URL}${localizePath(locale, `/blog/${post.slug}`)}`,
      lastModified: post.frontmatter.updated
        ? new Date(post.frontmatter.updated)
        : new Date(post.frontmatter.date),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
      alternates: { languages: languagesFor(`/blog/${post.slug}`, availableLocales) },
    }));
  });

  return [...localizedStaticEntries, ...blogIndexEntries, ...blogPostEntries];
}
