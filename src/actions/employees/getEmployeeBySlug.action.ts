import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import companyData from "../../data/company/company.data.json";
import { fetchDigitalBusinessCardBySlug } from "../../services/employees/digitalBusinessCard.service";
import type { EmployeeBusinessCard } from "../../types/vcard";
import {
  mapCompanyRecord,
  mapEmployeeToBusinessCard,
} from "./getEmployees.action";

export interface GetEmployeeBySlugResult {
  message: string;
  data: EmployeeBusinessCard;
}

export const getEmployeeBySlug = defineAction({
  input: z.object({
    slug: z.string().min(1, "Employee slug is required"),
  }),
  handler: async ({ slug }): Promise<GetEmployeeBySlugResult> => {
    const normalizedSlug = slug.trim().toLowerCase();

    let found;
    try {
      found = await fetchDigitalBusinessCardBySlug(normalizedSlug);
    } catch (error) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve employee",
      });
    }

    if (!found) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: `Employee '${slug}' not found`,
      });
    }

    const baseCompany = mapCompanyRecord(companyData);

    return {
      message: "Employee retrieved successfully",
      data: mapEmployeeToBusinessCard(found, baseCompany),
    };
  },
});
