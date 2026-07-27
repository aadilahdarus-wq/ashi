// Shared Google Ads API client setup, used by all app/api/google-ads/* routes.
// Centralising this means credential-loading logic only lives in one place.

/**
 * @param customerId Optional override — the Google Ads Customer ID of the
 * currently selected client (from the clients table). Falls back to the
 * single-account env var for backward compatibility.
 */
export async function getGoogleAdsCustomer(customerId?: string | null) {
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_ADS_REFRESH_TOKEN;
  const loginCustomerId = process.env.GOOGLE_ADS_LOGIN_CUSTOMER_ID;
  const resolvedCustomerId = customerId || process.env.GOOGLE_ADS_CUSTOMER_ID;

  if (!developerToken || !clientId || !clientSecret || !refreshToken || !resolvedCustomerId) {
    throw new Error("Google Ads credentials not configured");
  }

  const { GoogleAdsApi } = await import("google-ads-api");

  const client = new GoogleAdsApi({
    client_id: clientId,
    client_secret: clientSecret,
    developer_token: developerToken,
  });

  return client.Customer({
    customer_id: resolvedCustomerId,
    refresh_token: refreshToken,
    login_customer_id: loginCustomerId,
  });
}

/**
 * The google-ads-api library doesn't always throw plain Error instances —
 * API failures often come back as GoogleAdsFailure objects with a nested
 * `errors` array instead. Pulling the real message out here means routes
 * surface the actual reason (e.g. "not authorized", "customer not found")
 * instead of a generic fallback string.
 */
export function formatGoogleAdsError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (error && typeof error === "object") {
    const anyErr = error as Record<string, any>;

    const nestedMessages: string[] = Array.isArray(anyErr.errors)
      ? anyErr.errors
          .map((e: any) => e?.message || e?.error_code?.error_code || null)
          .filter(Boolean)
      : [];
    if (nestedMessages.length > 0) return nestedMessages.join("; ");

    if (typeof anyErr.message === "string" && anyErr.message) return anyErr.message;

    try {
      const serialized = JSON.stringify(anyErr);
      if (serialized && serialized !== "{}") return serialized.slice(0, 500);
    } catch {
      // fall through
    }
  }

  return "Unknown Google Ads API error";
}
