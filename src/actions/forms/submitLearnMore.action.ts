import { ActionError, defineAction } from "astro:actions";
import { z } from "astro:schema";
import {
  submitLearnMoreForm,
  type FormApiResponse,
} from "../../services/forms/forms.service";

export interface SubmitLearnMoreResult {
  message: string;
  data: {
    success: boolean;
    response?: FormApiResponse;
  };
}

function formatPhoneNumber(phone?: string, dialCode?: string): string {
  const cleanPhone = (phone ?? "").trim();
  if (!cleanPhone) return "";

  if (cleanPhone.startsWith("+")) {
    return cleanPhone;
  }

  const cleanDial = (dialCode ?? "").trim();
  return cleanDial ? `${cleanDial} ${cleanPhone}` : cleanPhone;
}

export const submitLearnMore = defineAction({
  accept: "form",
  input: z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Invalid email format"),
    phone: z.string().trim().optional().default(""),
    phoneDialCode: z.string().trim().optional().default(""),
    language: z.string().trim().min(1, "Language is required"),
    message: z.string().trim().min(2, "Message is too short"),
  }),
  handler: async (input): Promise<SubmitLearnMoreResult> => {
    try {
      const formattedPhone = formatPhoneNumber(input.phone, input.phoneDialCode);

      const response = await submitLearnMoreForm({
        first_name: input.name,
        email_address: input.email,
        phone: formattedPhone,
        language: input.language,
        message: input.message,
      });

      return {
        message: response.message ?? "Learn more inquiry submitted successfully",
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
            : "Failed to submit learn more inquiry",
      });
    }
  },
});
