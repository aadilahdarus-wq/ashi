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
