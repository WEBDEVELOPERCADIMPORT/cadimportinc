import { LANGUAGES, type Lang } from "./config.i18n";
import { routingConfig } from "./routing.config";
import globalContent from "../data/site-global-content.json";
import brandsData from "../data/brands/brands.data.json";

const defaultLang: Lang = routingConfig.defaultLocale;
const redirectBrandSlugs = new Set(
    (brandsData.brands || [])
        .filter((brand) => brand.isRedirect)
        .map((brand) => brand.slug)
);

export interface NavItem {
    id: string;
    label: string;
    path: string;
    href: string;
    children?: NavItem[];
}

export function getLangFromUrl(url: URL): Lang {
    const [, lang] = url.pathname.split('/');
    // Si la URL empieza con un idioma válido (ej. /es/catalog), devuelve 'es'.
    // Si no tiene prefijo (ej. /catalog o /), devuelve defaultLang ('en').
    if (lang in LANGUAGES) return lang as Lang;
    return defaultLang;
}

export const buildHref = (lang: Lang, path: string): string => {
    const shouldOmitPrefix = routingConfig.useSource && lang === routingConfig.defaultLocale;
    const prefix = shouldOmitPrefix ? '' : `/${lang}`;

    // Limpiar slash inicial por si en el JSON algún path viene como "/catalog" en vez de "catalog"
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;

    if (cleanPath.startsWith('#')) {
        return `${prefix}/${cleanPath}`; // Devuelve "/#seccion" (en) o "/es/#seccion" (es)
    }

    if (cleanPath === "") {
        return shouldOmitPrefix ? '/' : `${prefix}/`;
    }

    return `${prefix}/${cleanPath}`; // Devuelve "/catalog" (en) o "/es/catalog" (es)
};

export const useTranslations = (lang: Lang) => {
    const content = globalContent[lang] ?? globalContent[defaultLang];

    const navLinks: NavItem[] = content.nav.map((item: any) => {
        // Tolerancia a erratas comunes de tipado (children vs chilndren)
        const rawChildren = item.children || item.chilndren;

        const children = rawChildren
            ?.filter((child: any) => {
                const match = typeof child.path === "string" ? child.path.match(/^own-brands\/([^/]+)$/) : null;
                return !(match && redirectBrandSlugs.has(match[1]));
            })
            .map((child: any) => ({
                ...child,
                href: buildHref(lang, child.path)
            }));

        return {
            ...item,
            href: buildHref(lang, item.path),
            ...(children ? { children } : {})
        };
    });

    return {
        ...content,
        navLinks
    };
};