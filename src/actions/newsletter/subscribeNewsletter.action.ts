import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const subscribeNewsletter = defineAction({
  accept: "form",
  input: z.object({
    firstName: z.string().min(1, "First name is required"),
    email: z.string().email("Invalid email format"),
    preferredLanguage: z.string().default("en"),
  }),
  handler: async (input): Promise<{ message: string; data: { success: boolean; id: string } }> => {
    const subscriberId = crypto.randomUUID();
    return {
      message: "Subscribed to newsletter successfully",
      data: {
        success: true,
        id: subscriberId,
      },
    };
  },
});
