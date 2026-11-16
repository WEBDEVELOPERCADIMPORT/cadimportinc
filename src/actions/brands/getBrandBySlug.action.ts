import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import brandsData from "../../data/brands/brands.data.json";
import type { BrandItem } from "./getBrands.action";

export const getBrandBySlug = defineAction({
  input: z.object({
    slug: z.string().min(1, "Slug is required"),
  }),
  handler: async ({ slug }): Promise<{ message: string; data: BrandItem | null }> => {
    const all = (brandsData.brands || []) as BrandItem[];
    const found = all.find((b) => b.slug === slug);

    if (!found) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: `Brand '${slug}' not found`,
      });
    }

    return {
      message: "Brand retrieved successfully",
      data: found,
    };
  },
});
