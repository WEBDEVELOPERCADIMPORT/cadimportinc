export interface RawProductRecord {
  id: string;
  sku: string;
  name: string;
  image: string;
  brand_slug: string;
}

interface ApiContentItem {
  id: string;
  data: RawProductRecord;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiContentMeta {
  total?: number;
  limit?: number;
  page?: number;
}

interface ApiContentListResponse {
  status?: string;
  message?: string;
  items?: ApiContentItem[];
  data?: ApiContentItem[];
  meta?: ApiContentMeta;
}

interface ApiContentSingleResponse {
  status?: string;
  message?: string;
  item?: ApiContentItem;
  data?: ApiContentItem | RawProductRecord;
}

const DEFAULT_PAGE_LIMIT = 100;

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

async function fetchJson<T>(endpointPath: string): Promise<T | null> {
  const { baseUrl, apiKey } = getBackendConfig();
  const url = `${baseUrl}/${endpointPath.replace(/^\/+/, "")}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "x-api-key": apiKey,
      Accept: "application/json",
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Backend API request failed (${response.status} ${response.statusText})`
    );
  }

  return (await response.json()) as T;
}

function isValidProductRecord(record: unknown): record is RawProductRecord {
  if (!record || typeof record !== "object") return false;
  const candidate = record as Partial<RawProductRecord>;
  return Boolean(candidate.id && candidate.name && candidate.brand_slug);
}

/**
 * Fetches published products from the backend API, automatically paginating
 * through all pages when `meta.total` exceeds a single page.
 */
export async function fetchProducts(
  filters?: Record<string, string>
): Promise<RawProductRecord[]> {
  const results: RawProductRecord[] = [];
  let page = 1;

  while (true) {
    const params = new URLSearchParams({
      limit: String(DEFAULT_PAGE_LIMIT),
      page: String(page),
    });

    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value !== undefined && value !== "") {
          params.set(key, value);
        }
      }
    }

    const payload = await fetchJson<ApiContentListResponse>(
      `content/products?${params.toString()}`
    );

    if (!payload) break;

    const rawItems = payload.items ?? payload.data ?? [];
    const pageRecords = rawItems
      .map((item) => item?.data)
      .filter(isValidProductRecord);

    results.push(...pageRecords);

    const total = payload.meta?.total ?? results.length;
    if (results.length >= total || rawItems.length === 0) {
      break;
    }

    page += 1;
  }

  return results;
}

/**
 * Fetches published products for a given brand slug, handling hyphen/underscore
 * slug variations between frontend routes and backend records.
 */
export async function fetchProductsByBrand(
  brandSlug: string
): Promise<RawProductRecord[]> {
  const trimmed = brandSlug.trim();
  if (!trimmed) return [];

  const directMatch = await fetchProducts({ brand_slug: trimmed });
  if (directMatch.length > 0) {
    return directMatch;
  }

  const alternateSlug = trimmed.includes("-")
    ? trimmed.replace(/-/g, "_")
    : trimmed.includes("_")
      ? trimmed.replace(/_/g, "-")
      : null;

  if (!alternateSlug) {
    return [];
  }

  return fetchProducts({ brand_slug: alternateSlug });
}

/**
 * Fetches a single published product by its content item ID.
 */
export async function fetchProductById(
  itemId: string
): Promise<RawProductRecord | null> {
  const trimmed = itemId.trim();
  if (!trimmed) return null;

  const payload = await fetchJson<ApiContentSingleResponse>(
    `content/products/${encodeURIComponent(trimmed)}`
  );

  if (!payload) return null;

  const candidate =
    payload.item?.data ??
    (payload.data && "data" in payload.data ? payload.data.data : payload.data);

  return isValidProductRecord(candidate) ? candidate : null;
}
