import type { VCardSocialLinks } from "../../types/vcard";

export interface RawCompanyOverride {
  name?: string;
  secondary_address?: string;
  country_label?: string;
  website?: string;
  website_url?: string;
  phone?: string;
}

export interface RawEmployeeRecord {
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
  title: string;
  avatar: string;
  phone: string;
  other_phone: string;
  email: string;
  social: VCardSocialLinks;
  company_override?: RawCompanyOverride;
}

interface ApiContentItem {
  id: string;
  data: RawEmployeeRecord;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiContentResponse {
  status?: string;
  message?: string;
  items?: ApiContentItem[];
  data?: ApiContentItem[];
}

function getBackendConfig(): { baseUrl: string; apiKey: string } {
  const rawUrl =
    import.meta.env.BACKEND_API_URL ?? process.env.BACKEND_API_URL ?? "";
  const apiKey =
    import.meta.env.BACKEND_API_KEY ?? process.env.BACKEND_API_KEY ?? "";

  if (!rawUrl || !apiKey) {
    throw new Error(
      "Missing BACKEND_API_URL or BACKEND_API_KEY environment variables"
    );
  }

  return {
    baseUrl: rawUrl.replace(/\/+$/, ""),
    apiKey,
  };
}

async function requestContentItems(
  endpointPath: string
): Promise<RawEmployeeRecord[]> {
  const { baseUrl, apiKey } = getBackendConfig();
  const url = `${baseUrl}/${endpointPath.replace(/^\/+/, "")}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Backend API request failed (${response.status} ${response.statusText})`
    );
  }

  const payload = (await response.json()) as ApiContentResponse;
  const items = payload.items ?? payload.data ?? [];

  return items
    .map((item) => item?.data)
    .filter((record): record is RawEmployeeRecord => Boolean(record && record.slug));
}

/**
 * Fetches all published digital business card items from the backend API.
 */
export async function fetchDigitalBusinessCards(): Promise<RawEmployeeRecord[]> {
  return requestContentItems("content/digital-business-card");
}

/**
 * Fetches a single digital business card item by its slug from the backend API.
 */
export async function fetchDigitalBusinessCardBySlug(
  slug: string
): Promise<RawEmployeeRecord | null> {
  const normalizedSlug = slug.trim().toLowerCase();
  const records = await requestContentItems(
    `content/digital-business-card?slug=${encodeURIComponent(normalizedSlug)}`
  );

  return (
    records.find((record) => record.slug.toLowerCase() === normalizedSlug) ??
    null
  );
}
