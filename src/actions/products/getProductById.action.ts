import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import { fetchProductById } from "../../services/products/products.service";
import type { ProductItem } from "./getProductsByBrand.action";

export interface GetProductByIdResult {
  message: string;
  data: ProductItem;
}

export const getProductById = defineAction({
  input: z.object({
    itemId: z.string().min(1, "Product ID is required"),
  }),
  handler: async ({ itemId }): Promise<GetProductByIdResult> => {
    try {
      const product = await fetchProductById(itemId);

      if (!product) {
        throw new ActionError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      return {
        message: "Product retrieved successfully",
        data: product,
      };
    } catch (error) {
      if (error instanceof ActionError) throw error;
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve product",
      });
    }
  },
});
