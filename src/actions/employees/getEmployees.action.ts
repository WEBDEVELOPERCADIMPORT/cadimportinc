import { defineAction } from "astro:actions";
import employeesData from "../../data/employees/employees.data.json";
import type {
  EmployeeBusinessCard,
  VCardCompany,
  VCardSocialLinks,
} from "../../types/vcard";

export type { EmployeeBusinessCard, VCardData } from "../../types/vcard";

interface RawEmployeeRecord {
  id: string;
  slug: string;
  firstName: string;
  lastName: string;
  title: string;
  avatar: string;
  phone: string;
  otherPhone: string;
  email: string;
  social: VCardSocialLinks;
  companyOverride?: Partial<VCardCompany>;
}

export interface GetEmployeesResult {
  message: string;
  data: EmployeeBusinessCard[];
}

export function mapEmployeeToBusinessCard(
  raw: RawEmployeeRecord,
  baseCompany: VCardCompany
): EmployeeBusinessCard {
  const fullName = `${raw.firstName} ${raw.lastName}`.trim();
  const company: VCardCompany = raw.companyOverride
    ? { ...baseCompany, ...raw.companyOverride }
    : baseCompany;

  return {
    id: raw.id,
    slug: raw.slug,
    firstName: raw.firstName,
    lastName: raw.lastName,
    fullName,
    title: raw.title,
    avatar: raw.avatar,
    phone: raw.phone,
    otherPhone: raw.otherPhone || company.phone,
    email: raw.email,
    social: raw.social,
    company,
    vcard: {
      firstName: raw.firstName,
      lastName: raw.lastName,
      company: company.name,
      title: raw.title,
      phone: raw.phone,
      otherPhone: raw.otherPhone || company.phone,
      email: raw.email,
      address: company.address,
      website: company.websiteUrl,
    },
  };
}

export const getEmployees = defineAction({
  handler: async (): Promise<GetEmployeesResult> => {
    const company = employeesData.company as VCardCompany;
    const rawEmployees = (employeesData.employees || []) as RawEmployeeRecord[];
    const data = rawEmployees.map((emp) =>
      mapEmployeeToBusinessCard(emp, company)
    );

    return {
      message: "Employees retrieved successfully",
      data,
    };
  },
});
