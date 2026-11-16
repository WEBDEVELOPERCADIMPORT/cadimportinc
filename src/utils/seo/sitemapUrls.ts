import { LANGUAGES } from '../../i18n/config.i18n';
import departmentsData from '../../data/departments/departments.data.json';
import brandsData from '../../data/brands/brands.data.json';

const BASE_URL = 'https://cadimportinc.com';
const langs = Object.keys(LANGUAGES);

/**
 * Generate all static and dynamic localized URLs for the Astro sitemap
 */
export const getAllSitemapUrls = (): string[] => {
  const urls: string[] = [];

  for (const lang of langs) {
    // Core Pages
    urls.push(`${BASE_URL}/${lang}/`);
    urls.push(`${BASE_URL}/${lang}/about-us`);
    urls.push(`${BASE_URL}/${lang}/catalog`);
    urls.push(`${BASE_URL}/${lang}/own-brands`);
    urls.push(`${BASE_URL}/${lang}/contact`);
    urls.push(`${BASE_URL}/${lang}/privacy-policy`);

    // Department Landing Pages (under /[lang]/catalog/[department])
    for (const dept of departmentsData.departments) {
      urls.push(`${BASE_URL}/${lang}/catalog/${dept.slug}`);
    }

    // Own Brands Showcase Pages (under /[lang]/own-brands/[brand])
    for (const brand of brandsData.brands) {
      if (!brand.isRedirect) {
        urls.push(`${BASE_URL}/${lang}/own-brands/${brand.slug}`);
      }
    }
  }

  return urls;
};
