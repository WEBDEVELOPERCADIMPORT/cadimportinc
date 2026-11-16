import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import productsData from "../../data/products/products.data.json";

export interface ProductItem {
  id: string;
  slug: string;
  brandSlug: string;
  name: string;
  presentation: string;
  description: string;
  image: string;
  sku: string;
  catalogPdf: string;
}

export const getProductsByBrand = defineAction({
  input: z.object({
    brandSlug: z.string().min(1, "Brand slug is required"),
    lang: z.enum(["es", "en"]).default("en"),
  }),
  handler: async ({ brandSlug, lang }): Promise<{ message: string; data: ProductItem[] }> => {
    const list = ((productsData.products as Record<string, ProductItem[]>)[lang] || []) as ProductItem[];
    const filtered = list.filter((p) => p.brandSlug === brandSlug);

    return {
      message: "Products retrieved successfully",
      data: filtered,
    };
  },
});
