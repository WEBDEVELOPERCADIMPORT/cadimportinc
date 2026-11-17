import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import {
  formatPhoneNumber,
  submitContactForm,
  type FormApiResponse,
} from "../../services/forms/forms.service";

export interface SubmitContactResult {
  message: string;
  data: {
    success: boolean;
    response?: FormApiResponse;
  };
}

export const submitContact = defineAction({
  accept: "form",
  input: z.object({
    firstName: z.string().trim().min(2, "First name is required"),
    lastName: z.string().trim().min(2, "Last name is required"),
    email: z.string().trim().email("Invalid email format"),
    phone: z.string().trim().optional().default(""),
    phoneDialCode: z.string().trim().optional().default(""),
    language: z.string().trim().min(1, "Language is required"),
    message: z.string().trim().min(2, "Message too short"),
  }),
  handler: async (input): Promise<SubmitContactResult> => {
    try {
      const formattedPhone = formatPhoneNumber(input.phone, input.phoneDialCode);

      const response = await submitContactForm({
        first_name: input.firstName,
        last_name: input.lastName,
        email_address: input.email,
        phone: formattedPhone,
        language: input.language,
        request: input.message,
      });

      return {
        message: response.message ?? "Contact message sent successfully",
        data: {
          success: true,
          response,
        },
      };
    } catch (error) {
      if (error instanceof ActionError) {
        throw error;
      }

      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to submit contact form",
      });
    }
  },
});
