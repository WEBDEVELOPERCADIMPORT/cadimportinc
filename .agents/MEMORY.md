# MEMORY.md — Registro Central del Proyecto AutoUI (autroui)

> **Propósito**: Este archivo es la fuente de verdad sobre el estado actual, arquitectura, módulos, datos, acciones y componentes del starter kit **AutoUI (autroui)**.
> **Regla Inquebrantable**: Todo agente (`manager`, `coder`, `tester`) debe consultar este documento antes de planificar o modificar código, y el `manager` debe actualizarlo tras cada tarea verificada por el `tester`.

---

## 1. Identidad y Propósito del Starter Kit

- **Nombre**: AutoUI (`autroui`)
- **Template / Origen**: `KEVIN01306/autroui`
- **Propósito**: Starter kit de alto rendimiento y arquitectura modular para la creación, desarrollo y mantenimiento acelerado de sitios web modernos, landing pages, catálogos dinámicos por categoría y soluciones e-commerce multilingües.
- **Enfoque Principal**: Separación estricta entre presentación visual (componentes desacoplados en Astro), lógica de datos en el servidor (Astro Server Actions), contenidos estructurados internacionalizados (JSONs simétricos `es`/`en`) y despliegue edge en Cloudflare.

---

## 2. Stack Tecnológico y Configuración

- **Framework**: Astro `^6.1.6` (modo SSR: `output: 'server'`, con `@astrojs/cloudflare` `^13.1.9`).
- **Estilos**: Tailwind CSS `^4.2.2` integrado vía `@tailwindcss/vite` (`@import "tailwindcss";` en `src/styles/global.css`).
- **Lenguaje**: TypeScript (`strict` mode con `astro/tsconfigs/strict`).
- **Navegación e Interactividad**: Astro `ClientRouter` nativo; los scripts de cliente se inicializan en carga y en el evento `astro:page-load`.
- **Internacionalización (i18n)**:
  - Idiomas soportados: Español (`es`) e Inglés (`en`).
  - Configuración modular de enrutamiento en `src/i18n/routing.config.ts` (`useSource: boolean`, `defaultLocale: 'en'`).
  - Integrado en `astro.config.mjs` con `prefixDefaultLocale: !routingConfig.useSource`.
  - Diccionarios y helpers en `src/i18n/config.i18n.ts` y `src/i18n/utils.i18n.ts`.
- **SEO & Metadatos**:
  - `@astrojs/sitemap` con generación dinámica de URLs (`src/utils/seo/sitemapUrls.ts`).
  - `src/layouts/Layout.astro` con soporte para Open Graph, Twitter Cards, canonical tags, alternate hreflang y JSON-LD (`schema`).
- **Hosting / Deploy**: Cloudflare Pages / Workers (`wrangler` `^4.82.2`).

---

## 3. Mapa de Arquitectura y Capas

```plaintext
public/
└── images/                               # Galería estática de medios y recursos visuales
    ├── home/                             # Assets globales y de la página principal
    └── <categoria>/                      # Assets organizados por módulo/categoría
        ├── banner.png (o hero.png)
        ├── logo.png
        └── products/                     # Imágenes de productos de la categoría
            └── <slug-o-sku>.png

src/
├── actions/                              # Astro Server Actions (Lógica de servidor)
│   ├── index.ts                          # Registro central export const server = { ... }
│   └── <modulo>/                         # Módulos por dominio (ej. reviews/, products/)
│       └── <nombre>.action.ts
│
├── components/                           # Presentación pura (sin queries ni mutaciones)
│   ├── common/                           # UI global compartida (Navbar.astro, Footer.astro)
│   ├── ui/                               # Primitivas de UI
│   └── <pagina>/                         # Componentes de páginas específicas
│       ├── sections/                     # Bloques de sección completos (Hero.astro, FAQ.astro)
│       └── components/                   # Subcomponentes atómicos (Card.astro)
│
├── data/                                 # Contenido centralizado y fuentes locales
│   ├── site-global-content.json          # Textos compartidos, Navbar (con submenús) y Footer
│   ├── site-<pagina>-content.json        # Textos de página indexados por idioma ("es", "en")
│   └── <modulo>/                         # Colecciones de datos locales
│       └── <modulo>.data.json            # Entidades en plural (ej. products.data.json)
│
├── db/                                   # Capa de persistencia (opcional / extensible)
│   ├── index.ts                          # Cliente de base de datos
│   ├── schema.ts                         # Definición de tablas / esquemas
│   └── repositories/                     # Repositorios de acceso a datos
│
├── i18n/                                 # Configuración y utilidades de internacionalización
│   ├── config.i18n.ts                    # Constantes de idiomas y tipo Lang
│   └── utils.i18n.ts                     # Funciones utilitarias (getLangFromUrl, useTranslations)
│
├── layouts/                              # Plantillas maestras
│   └── Layout.astro                      # Head, SEO, metadatos y ClientRouter
│
├── pages/                                # Enrutamiento basado en archivos
│   ├── index.astro                       # Redirección raíz hacia /[defaultLocale]
│   ├── 404.astro                         # Página de error 404
│   └── [lang]/                           # Enrutamiento dinámico multilenguaje
│       ├── index.astro                   # Vista Home
│       └── [category]/                   # Vistas anidadas
│           ├── index.astro               # Catálogo / Vista de Categoría
│           └── [product]/
│               └── index.astro           # Detalle / Ficha de Producto
│
├── styles/                               # Estilos globales
│   └── global.css                        # Tailwind CSS v4 (@import "tailwindcss";)
│
└── utils/                                # Utilidades puras
    └── seo/
        └── sitemapUrls.ts                # Extractor dinámico de rutas para el sitemap
```

---

## 4. Estructuras de Sitio Predefinidas

### 1. `site_category_products` (E-commerce / Catálogo Dinámico)
- **Propósito**: Navegación multinivel por categorías y catálogo con ficha técnica detallada.
- **Páginas requeridas**:
  - Home: `src/pages/[lang]/index.astro`
  - Categoría: `src/pages/[lang]/[category]/index.astro`
  - Producto: `src/pages/[lang]/[category]/[product]/index.astro`
- **Datos requeridos** (`src/data/`):
  - `categories/categories.data.json`
  - `products/products.data.json`
  - `site-home-content.json`
- **Requerimiento de Insumos Visuales (Figma / Mockups)**:
  - Vista Home (Layout principal y secciones).
  - Vista Categoría (Hero de categoría y cuadrícula de productos).
  - Vista Producto (Ficha técnica, galería de imágenes y detalles).

---

## 5. Módulos y Estado Actual del Starter Kit

| Módulo / Capa | Directorio / Archivo | Estado | Descripción |
| :--- | :--- | :--- | :--- |
| **Global Layout & SEO** | `src/layouts/Layout.astro` | Activo | Plantilla base con Open Graph, Twitter Cards, `ClientRouter` y JSON-LD adaptado a CAD Import Inc. |
| **Estilos Globales & Tokens** | `src/styles/global.css` | Activo | Tokens centralizados Tailwind v4 (@theme con paleta CAD y marcas propias, utilidades de botones e inputs). |
| **Internacionalización** | `src/i18n/` | Activo | Idiomas `es` y `en` con helpers de traducción y rutas. |
| **Navbar & Footer** | `src/components/common/` | Activo | Header con selector bilingüe, logo CAD, dropdowns; Footer con 3 columnas (ubicaciones, newsletter, Vas al Super/Amazon). |
| **Home Page** | `src/pages/[lang]/index.astro` | Activo | 8 secciones modulares (Hero, IntroOverview, DistributionCta, MetricsCounter, DistributionChannels, Testimonials, BrandsCarousel, RepContactForm). |
| **About Us Page** | `src/pages/[lang]/about-us/` | Activo | 4 secciones modulares (Hero, MissionOverview, SupplyChainFlow, DistributionSimplified con Exclusive Partners). |
| **Catalog & Departments** | `src/pages/[lang]/catalog/` | Activo | Catálogo general (Hero, DownloadCatalogCard, DepartmentsGrid, OfferingsAndContact) y landing de departamentos (`[department]`). |
| **Own Brands & Showcase** | `src/pages/[lang]/own-brands/` | Activo | Directorio de marcas propias y ficha de exhibición B2B (`[brand]`) con cuadrícula de productos sin botones de compra. |
| **Contact Us Page** | `src/pages/[lang]/contact/` | Activo | Hero, ContactMain (Headquarters info + Formulario) y MapEmbed (Google Maps New Castle DE). |
| **Server Actions** | `src/actions/` | Activo | Módulos `departments`, `brands`, `products`, `contact`, `newsletter` registrados en `server`. |
| **Capa de Datos** | `src/data/` | Activo | JSONs i18n (`site-*-content.json`) y entidades locales (`departments.data.json`, `brands.data.json`, `products.data.json`). |
| **Sitemap Dinámico** | `src/utils/seo/sitemapUrls.ts` | Activo | Inyección dinámica de todas las rutas fijas y parametrizadas por departamento y marca. |

---

## 6. Convenciones y Reglas Inquebrantables

1. **Presentación Pura en Componentes**:
   - `src/components/` jamás realiza llamadas directas a base de datos ni mutaciones; recibe datos por props y textos por `lang`.
2. **Server Actions como Única Vía de Datos Dinámicos**:
   - Se crean en `src/actions/<modulo>/<accion>.action.ts` y se registran en `src/actions/index.ts`.
   - Tipado estricto `Promise<{ message: string, data: T }>`. Cero HTML devuelto.
3. **Simetría Multilenguaje Estricta**:
   - En `src/data/`, cada clave en `"es"` debe existir exactamente igual en `"en"`.
4. **Validación de Idioma en Páginas**:
   - Toda página bajo `src/pages/[lang]/` valida que `lang` pertenezca a `LANGUAGES` y redirige a `/404` si no existe.
5. **ClientRouter y Scripts**:
   - Todo script en componentes que añada interactividad debe suscribirse a `astro:page-load`.
6. **Convención Modular de Imágenes**:
   - Toda imagen se almacena en `public/images/<categoria>/...` o `public/images/home/`.

---

## 7. Catálogo de Agentes y Skills del Proyecto

### Agentes (`.agents/agents/`)
- **`manager`**: Líder técnico y orquestador. Confirma insumos visuales, estructura las tareas (`#Task-XX`), asigna skills y coordina con el `tester`.
- **`coder`**: Desarrollador enfocado. Implementa una tarea a la vez en modo `triage` o `implement` siguiendo las skills de AutoUI.
- **`tester`**: Auditor de calidad y arquitectura. Valida tipos, build y cumplimiento estricto de las reglas arquitectónicas de AutoUI.

### Skills Técnicas (`.agents/skills/`)
- **`create-data`**: Creación de diccionarios i18n (`site-<pagina>-content.json`), configuración global y entidades locales (`.data.json`).
- **`create-action`**: Creación y tipado de Server Actions en `src/actions/` y registro en `index.ts`.
- **`create-component`**: Componentes visuales puros con Tailwind CSS v4, carga de copys por `lang` y scripts con `astro:page-load`.
- **`create-page`**: Páginas dinámicas multilenguaje bajo `[lang]`, validación con redirección 404, llamadas `Astro.callAction` y Layout SEO.

---

## 8. Historial de Cambios (Changelog)

| Fecha | Identificador | Capa | Resumen del Cambio | Verificado Por |
| :--- | :--- | :--- | :--- | :--- |
| 2026-11-11 | `#CAD-i18n-Default-English-NoMiddleware` | Routing & i18n | Configuración de `en` como idioma predeterminado en `astro.config.mjs` y `utils.i18n.ts`; se eliminó `src/middleware.ts` a petición del usuario para manejar el enrutamiento nativo directamente. | Manager & Tester AutoUI |
| 2026-11-11 | `#CAD-Department-RootRoutes-Dropdown` | Routing, Nav & Data | Migración de páginas dinámicas de departamento desde `/[lang]/catalog/[department]` a la raíz `/[lang]/[department]` con slugs exactos (`healthandbeauty`, `household`, `overthecountermedicines`, `vitaminsandsupplements`, `childrenandinfants`, `grocery`). Actualización del menú desplegable `CURRENT CATALOG` con nombres en mayúsculas idénticos, resaltado activo padre/hijo en `#fff1ba` y actualización de `DepartmentsGrid.astro` y `sitemapUrls.ts`. | Manager & Tester AutoUI |
| 2026-11-11 | `#CAD-CatalogDepartments-ExactSync` | Data, Actions & UI | Sincronización completa de las 5 páginas de departamento del catálogo (`groceries`, `otc-medicines`, `children-infants`, `household-products`, `health-and-beauty` + `supplements`) en `departments.data.json` (`es`/`en`), `getDepartments.action.ts` y `FeaturedBrands.astro`: fondo blanco limpio, collage de 500x500px con placeholder dimensional, canasta azul marino sólida, títulos exactos de banner/collage y checklist dividida en 2 columnas equilibradas con `"And more!"` al final derecho. | Manager & Tester AutoUI |
| 2026-11-11 | `#CAD-Sitewide-ScrollAnimations` | Animations & All Pages | Despliegue de animaciones globales de scroll (`fade-up`, `fade-in`, `slide-in-left`, `slide-in-right`, `bubble-pop`) respetando la configuración personalizada de `animations.css` en todas las páginas del sitio (Home, About Us, Catalog, Department, Own Brands, Brand Detail, Contact y Privacy Policy) con `overflow-x-clip` y `threshold: 0.05`. | Manager & Tester AutoUI |
| 2026-11-11 | `#CAD-GlobalAnimations-CatalogBanner` | Animations & UI | Creación del sistema global de animaciones en `src/animations/` (`animations.css` + `scrollAnimations.ts` conectado globalmente en `Layout.astro` y `global.css`). Aplicación en `CatalogBanner.astro`: botón con entrada moderada desde la derecha (`data-animate="slide-in-right"`) y portada del catálogo con efecto burbuja desde el centro (`data-animate="bubble-pop"`, escala pequeña → mayor a su tamaño → tamaño normal) disparados al hacer scroll. | Manager & Tester AutoUI |
| 2026-11-11 | `#CAD-ContactMain-ExactRedesign` | UI Components & Data | Rediseño exacto de `ContactMain.astro` y `site-contact-content.json` según referencia visual: tarjeta azul `#013764` sin bordes internos con viñeta Delaware y enlaces en verde lima `#7ebc00`; formulario directo sobre fondo blanco con campos apilados de 1 columna, icono de sobre en email, `PhoneInput` modo `seamless`, select con placeholder integrado y botón verde `#18bd5b` (`Send message`). | Manager & Tester AutoUI |
| 2026-11-10 | `#CAD-PrivacyPolicy-JSON-i18n` | Data & Pages | Migración completa del texto íntegro de la Política de Privacidad a `src/data/site-privacy-content.json` con simetría rigurosa `es`/`en` (definiciones, CCPA/CPRA, GDPR, cookies, remarketing, Facebook fan page, etc.) y renderizado dinámico en `src/pages/[lang]/privacy-policy/index.astro`. | Manager & Tester AutoUI |
| 2026-11-10 | `#CAD-PrivacyPolicy-Page-ConsentLink` | Pages & UI | Creación de la página completa de Política de Privacidad (`/[lang]/privacy-policy`) con todo el texto legal (definiciones, CCPA/CPRA, GDPR, CalOPPA, Shine the Light, menores, etc.), exclusión del Navbar, enlace interactivo en el formulario del catálogo (`OfferingsAndContact.astro`) e inclusión en barra de copyright del footer y sitemap. | Manager & Tester AutoUI |
| 2026-11-10 | `#CAD-DistributionSimplified-Redesign` | UI Components | Rediseño idéntico de `DistributionSimplified.astro`: fondo blanco limpio, título en azul marino `#013764`, textos justificados, cabecera `Exclusive Partners` con líneas punteadas teal `#299899` en ambos lados y cuadrícula de 2 columnas con 14 socios y estrellas doradas `#f3d120`. | Manager & Tester AutoUI |
| 2026-11-10 | `#CAD-SupplyChainFlow-Upscale` | UI Components & Assets | Aumento sustancial de escala en `SupplyChainFlow.astro`: iconos ampliados a `max-h-20 sm:max-h-28 md:max-h-36`, contenedores de hasta `w-72`, flechas de hasta `w-7`, tipografía a `text-xl md:text-2xl font-bold` y assets renderizados a alta resolución 4x para nitidez total. | Manager & Tester AutoUI |
| 2026-11-10 | `#CAD-SupplyChainFlow-Redesign` | UI Components & Assets | Rediseño idéntico a la referencia del flujo en `SupplyChainFlow.astro`: fondo blanco limpio sin cajas ni sombras, iconos exactos (engranajes Manufacturer en `#013764`, camión Distributor en `#299898`, etiquetas Retailer en `#7cc003`), flechas chevron rojas centradas (`#ed3f2d`) y títulos corporativos. | Manager & Tester AutoUI |
| 2026-11-10 | `#CAD-Brands-Carousel-Autoplay` | UI Components & Data | Carrusel interactivo y responsivo de marcas en el Home (`BrandsCarousel.astro`) con botones de navegación funcionales (`<` y `>`), avance automático cada 3 segundos, pausa al interactuar (hover/touch), fallback visual de texto y suscripción a `astro:page-load`. | Manager & Tester AutoUI |
| 2026-11-10 | `#CAD-MetricsCounter-Animation` | UI Components & Data | Animación de conteo desde 0 hasta el objetivo numérico (30+ Marcas, 2,500+ Productos, 1,500+ Representaciones, 6 Categorías) y barra circular SVG de progreso que se llena completamente al 100% con color `#F9AB39` activada al hacer scroll con IntersectionObserver y soporte `astro:page-load`. | Manager & Tester AutoUI |
| 2026-11-10 | `#CAD-Gradient-Overlay-Unified` | UI Components | Unificación global del degradado corporativo en todos los Heroes y formularios con las medidas `via-[#0b3c61]/60 via-30%`. | Manager & Tester AutoUI |
| 2026-11-10 | `#CAD-CatalogBanner-Components` | UI Components | Creación de CatalogBanner reutilizable (variantes large y compact) con portada de catálogo que sobrepasa el Hero (-mt), enlace interactivo al PDF e integración en catalog, own-brands y catalog/[department]. | Manager & Tester AutoUI |
| 2026-11-10 | `#CAD-Catalog-Image-Clickable` | UI Components | Enlace en la portada de imagen del catálogo para abrir el PDF (/catalogo.pdf) en nueva pestaña al hacer click. | Manager & Tester AutoUI |
| 2026-11-10 | `#CAD-DistributionCta-Catalog` | UI Components | Rediseño de DistributionCta según captura: portada del catálogo con sombra a la izquierda, texto descriptivo y botón DOWNLOAD OUR CATALOG que abre enlace a PDF (/catalogo.pdf). | Manager & Tester AutoUI |
| 2026-11-10 | `#CAD-Testimonials-Slider` | UI Components | Slider dinámico de testimonios con 5 citas, botones circulares verde lima (< y >) según captura y autoplay cada 8 segundos. | Manager & Tester AutoUI |
| 2026-11-10 | `#CAD-Testimonials-BgImage` | UI Components | Integración de imagen de fondo /images/home/testimonials.png con overlay teal dominante (#299898) en la sección de Testimonials. | Manager & Tester AutoUI |
| 2026-11-10 | `#CAD-Navbar-Dropdown-Color` | UI Components | Homologación de color del menú desplegable y drawer móvil a `#299898` idéntico al Navbar con resaltado `#fff1ba`. | Manager & Tester AutoUI |
| 2026-11-10 | `#CAD-Navbar-LeftAlign-Highlight` | UI Components | Alineación de los enlaces del Navbar a la izquierda junto al logo y remarcado con color `#fff1ba` tanto en estado hover como activo. | Manager & Tester AutoUI |
| 2026-11-10 | `#CAD-Hero-RepForm-Gradient` | UI Components | Rediseño de RepContactForm (imagen de fondo con overlay degradado #0b3c61 a la izquierda y derecha libre) y unificación de todos los Hero con el degradado azul marino corporativo. | Manager & Tester AutoUI |
| 2026-11-10 | `#CAD-Navbar-Footer-PhoneInput` | UI & Data Layer | Integración de Navbar con logo CAD circular saliente e i18n switcher, Footer de 4 columnas con stores y newsletter, e input de teléfono PhoneInput con listado dinámico de países (countries.data.json) con Guatemala por defecto. | Manager & Tester AutoUI |
| 2026-11-10 | `#CAD-Import-Architecture` | Sistema Completo | Implementación completa de CAD Import Inc: estilos centralizados en `global.css`, datos simétricos `es`/`en` en `src/data/`, Server Actions en `src/actions/`, componentes y secciones modulares ligeros en `src/components/`, páginas i18n (`/`, `/about-us`, `/catalog`, `/catalog/[department]`, `/own-brands`, `/own-brands/[brand]`, `/contact`), sitemap dinámico y ClientRouter. | Manager & Tester AutoUI |
| 2026-10-26 | `#Init-AutoUI-Agents` | Sistema de Agentes | Reconfiguración completa del ecosistema multi-agente (`manager`, `coder`, `tester`), catálogo de skills (`create-data`, `create-action`, `create-component`, `create-page`), actualización de `MEMORY.md`, `AGENTS.md` y `CLAUDE.md` orientados al starter kit AutoUI (Astro, Tailwind CSS v4, i18n, Cloudflare). | Manager AutoUI |
