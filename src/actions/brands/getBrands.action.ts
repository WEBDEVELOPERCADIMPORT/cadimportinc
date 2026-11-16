import { defineAction } from "astro:actions";
import brandsData from "../../data/brands/brands.data.json";

export interface BrandItem {
  id: string;
  slug: string;
  name: string;
  logo: string;
  badgeColor: string;
  description: { es: string; en: string };
  ctaText: { es: string; en: string };
  catalogPdf: string;
}

export const getBrands = defineAction({
  handler: async (): Promise<{ message: string; data: BrandItem[] }> => {
    const data = (brandsData.brands || []) as BrandItem[];
    return {
      message: "Brands retrieved successfully",
      data,
    };
  },
});
