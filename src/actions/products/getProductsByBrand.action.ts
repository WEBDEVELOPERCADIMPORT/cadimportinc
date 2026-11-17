import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import {
  fetchProductsByBrand,
  type RawProductRecord,
} from "../../services/products/products.service";

export type ProductItem = RawProductRecord;

export interface GetProductsResult {
  message: string;
  data: ProductItem[];
}

export const getProductsByBrand = defineAction({
  input: z.object({
    brandSlug: z.string().min(1, "Brand slug is required"),
    lang: z.enum(["es", "en"]).default("en"),
  }),
  handler: async ({ brandSlug }): Promise<GetProductsResult> => {
    try {
      const products = await fetchProductsByBrand(brandSlug);

      return {
        message: "Products retrieved successfully",
        data: products,
      };
    } catch (error) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve products",
      });
    }
  },
});
