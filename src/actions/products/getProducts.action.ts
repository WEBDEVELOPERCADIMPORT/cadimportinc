import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { fetchProducts } from "../../services/products/products.service";
import type { GetProductsResult } from "./getProductsByBrand.action";

export const getProducts = defineAction({
  input: z
    .object({
      filters: z.record(z.string(), z.string()).optional(),
    })
    .optional(),
  handler: async (input): Promise<GetProductsResult> => {
    try {
      const products = await fetchProducts(input?.filters);

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
