import { defineAction } from "astro:actions";
import departmentsData from "../../data/departments/departments.data.json";

export interface DepartmentItem {
  id: string;
  slug: string;
  name: { es: string; en: string };
  heroTitle: { es: string; en: string };
  heroDescription: { es: string; en: string };
  bannerTitle?: { es: string; en: string };
  collageTitle?: { es: string; en: string };
  checklistTitle?: { es: string; en: string };
  image: string;
  collageImage?: string;
  featuredBrands: string[];
  items: { es: string[]; en: string[] };
}

export const getDepartments = defineAction({
  handler: async (): Promise<{ message: string; data: DepartmentItem[] }> => {
    const data = (departmentsData.departments || []) as DepartmentItem[];
    return {
      message: "Departments retrieved successfully",
      data,
    };
  },
});
