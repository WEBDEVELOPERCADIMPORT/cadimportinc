import { defineAction, ActionError } from "astro:actions";
import companyData from "../../data/company/company.data.json";
import {
  fetchDigitalBusinessCards,
  type RawEmployeeRecord,
} from "../../services/employees/digitalBusinessCard.service";
import type { EmployeeBusinessCard, VCardCompany } from "../../types/vcard";

export type { EmployeeBusinessCard, VCardData } from "../../types/vcard";

interface RawCompanyRecord {
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    formatted: string;
  };
  website: string;
  website_url: string;
  phone: string;
}

export interface GetEmployeesResult {
  message: string;
  data: EmployeeBusinessCard[];
}

export function mapCompanyRecord(raw: RawCompanyRecord): VCardCompany {
  return {
    name: raw.name,
    address: {
      street: raw.address.street,
      city: raw.address.city,
      state: raw.address.state,
      postalCode: raw.address.postal_code,
      country: raw.address.country,
      formatted: raw.address.formatted,
    },
    website: raw.website,
    websiteUrl: raw.website_url,
    phone: raw.phone,
  };
}

export function mapEmployeeToBusinessCard(
  raw: RawEmployeeRecord,
  baseCompany: VCardCompany
): EmployeeBusinessCard {
  const fullName = `${raw.first_name} ${raw.last_name}`.trim();
  const override = raw.company_override;

  const company: VCardCompany = override
    ? {
        ...baseCompany,
        ...(override.name ? { name: override.name } : {}),
        ...(override.secondary_address
          ? { secondaryAddress: override.secondary_address }
          : {}),
        ...(override.country_label
          ? { countryLabel: override.country_label }
          : {}),
        ...(override.website ? { website: override.website } : {}),
        ...(override.website_url ? { websiteUrl: override.website_url } : {}),
        ...(override.phone ? { phone: override.phone } : {}),
      }
    : baseCompany;

  const otherPhone = raw.other_phone || company.phone;

  return {
    id: raw.id,
    slug: raw.slug,
    firstName: raw.first_name,
    lastName: raw.last_name,
    fullName,
    title: raw.title,
    avatar: raw.avatar,
    phone: raw.phone,
    otherPhone,
    email: raw.email,
    social: raw.social,
    company,
    vcard: {
      firstName: raw.first_name,
      lastName: raw.last_name,
      company: company.name,
      title: raw.title,
      phone: raw.phone,
      otherPhone,
      email: raw.email,
      address: company.address,
      website: company.websiteUrl,
    },
  };
}

export const getEmployees = defineAction({
  handler: async (): Promise<GetEmployeesResult> => {
    try {
      const baseCompany = mapCompanyRecord(companyData as RawCompanyRecord);
      const rawEmployees = await fetchDigitalBusinessCards();
      const data = rawEmployees.map((emp) =>
        mapEmployeeToBusinessCard(emp, baseCompany)
      );

      return {
        message: "Employees retrieved successfully",
        data,
      };
    } catch (error) {
      throw new ActionError({
        code: "INTERNAL_SERVER_ERROR",
        message:
          error instanceof Error
            ? error.message
            : "Failed to retrieve employees",
      });
    }
  },
});
