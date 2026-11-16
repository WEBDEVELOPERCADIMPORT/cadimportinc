import { defineAction } from "astro:actions";
import { z } from "astro:schema";
import productsData from "../../data/products/products.data.json";

export interface ProductItem {
  id: string;
  brandSlug: string;
  category: string;
  name: string;
  image: string;
  sku: string;
}

export const getProductsByBrand = defineAction({
  input: z.object({
    brandSlug: z.string().min(1, "Brand slug is required"),
    lang: z.enum(["es", "en"]).default("en"),
  }),
  handler: async ({ brandSlug }): Promise<{ message: string; data: ProductItem[] }> => {
    const normalizedSlug = brandSlug.replace(/-/g, "_").toLowerCase();
    const list = (productsData.products || []) as ProductItem[];
    const filtered = list.filter(
      (p) => p.brandSlug.replace(/-/g, "_").toLowerCase() === normalizedSlug
    );

    return {
      message: "Products retrieved successfully",
      data: filtered,
    };
  },
});
