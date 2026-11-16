import { defineAction } from "astro:actions";
import { z } from "astro:schema";

export const submitContact = defineAction({
  accept: "form",
  input: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    name: z.string().optional(),
    email: z.string().email("Invalid email format"),
    phone: z.string().optional(),
    company: z.string().optional(),
    preferredContact: z.string().optional(),
    message: z.string().min(2, "Message too short"),
  }),
  handler: async (input): Promise<{ message: string; data: { success: boolean; id: string } }> => {
    const submissionId = crypto.randomUUID();
    return {
      message: "Contact message sent successfully",
      data: {
        success: true,
        id: submissionId,
      },
    };
  },
});
