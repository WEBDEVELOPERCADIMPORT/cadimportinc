import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";
import departmentsData from "../../data/departments/departments.data.json";
import type { DepartmentItem } from "./getDepartments.action";

export const getDepartmentBySlug = defineAction({
  input: z.object({
    slug: z.string().min(1, "Slug is required"),
  }),
  handler: async ({ slug }): Promise<{ message: string; data: DepartmentItem | null }> => {
    const all = (departmentsData.departments || []) as DepartmentItem[];
    const found = all.find((d) => d.slug === slug);

    if (!found) {
      throw new ActionError({
        code: "NOT_FOUND",
        message: `Department '${slug}' not found`,
      });
    }

    return {
      message: "Department retrieved successfully",
      data: found,
    };
  },
});
