import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import employeesData from "../../data/employees/employees.data.json";
import type { EmployeeBusinessCard, VCardCompany } from "../../types/vcard";
import { mapEmployeeToBusinessCard } from "./getEmployees.action";

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
    const company = employeesData.company as VCardCompany;
    const rawEmployees = employeesData.employees || [];

    const found = rawEmployees.find(
      (emp) => emp.slug.toLowerCase() === normalizedSlug
    );

    if (!found) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: `Employee '${slug}' not found`,
      });
    }

    return {
      message: "Employee retrieved successfully",
      data: mapEmployeeToBusinessCard(found, company),
    };
  },
});
