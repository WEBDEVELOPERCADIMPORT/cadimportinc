export interface NewDistributorPayload {
  first_name: string;
  email_address: string;
  phone?: string;
  company?: string;
  message: string;
}

export interface LearnMorePayload {
  first_name: string;
  email_address: string;
  phone?: string;
  language: string;
  message: string;
}

export interface ContactFormPayload {
  first_name: string;
  last_name: string;
  email_address: string;
  phone?: string;
  language: string;
  request: string;
}

export interface FormApiResponse {
  status?: string;
  message?: string;
  data?: unknown;
}

export type NewDistributorApiResponse = FormApiResponse;

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

async function postForm<TResponse = FormApiResponse>(
  endpointPath: string,
  payload: unknown
): Promise<TResponse> {
  const { baseUrl, apiKey } = getBackendConfig();
  const url = `${baseUrl}/${endpointPath.replace(/^\/+/, "")}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let errorDetail = `${response.status} ${response.statusText}`;
    try {
      const errorBody = (await response.json()) as {
        message?: string;
        error?: string;
      };
      if (errorBody?.message || errorBody?.error) {
        errorDetail = errorBody.message ?? errorBody.error ?? errorDetail;
      }
    } catch {
      // Ignore non-JSON error bodies and keep HTTP status text
    }

    throw new Error(`Form submission failed (${endpointPath}): ${errorDetail}`);
  }

  const text = await response.text();
  if (!text) {
    return { status: "success" } as TResponse;
  }

  try {
    return JSON.parse(text) as TResponse;
  } catch {
    return { status: "success", message: text } as TResponse;
  }
}

/**
 * Submits the interested distributor form to the backend API.
 */
export async function submitNewDistributorForm(
  payload: NewDistributorPayload
): Promise<FormApiResponse> {
  return postForm<FormApiResponse>("forms/new-distributor/submit", payload);
}

/**
 * Submits the Learn More form to the backend API.
 */
export async function submitLearnMoreForm(
  payload: LearnMorePayload
): Promise<FormApiResponse> {
  return postForm<FormApiResponse>("forms/learn-more/submit", payload);
}

/**
 * Submits the Contact Us form to the backend API.
 */
export async function submitContactForm(
  payload: ContactFormPayload
): Promise<FormApiResponse> {
  return postForm<FormApiResponse>("forms/contact-form/submit", payload);
}

/**
 * Combines a dial code and phone number into a single formatted string.
 */
export function formatPhoneNumber(phone?: string, dialCode?: string): string {
  const cleanPhone = (phone ?? "").trim();
  if (!cleanPhone) return "";

  if (cleanPhone.startsWith("+")) {
    return cleanPhone;
  }

  const cleanDial = (dialCode ?? "").trim();
  return cleanDial ? `${cleanDial} ${cleanPhone}` : cleanPhone;
}
