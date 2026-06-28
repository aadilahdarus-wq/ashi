export function sanitizeUtmParam(value: string): string {
  return value.replace(/\s+/g, "-");
}

export type UtmParams = {
  destination: string;
  source: string;
  medium: string;
  campaign: string;
  term: string;
  content: string;
};

export type UtmPreviewSegment = {
  text: string;
  type: "base" | "separator" | "param" | "value";
};

export function buildUtmUrl(params: UtmParams): string {
  const destination = params.destination.trim();
  if (!destination) return "";

  const queryParts: string[] = [];

  if (params.source) queryParts.push(`utm_source=${params.source}`);
  if (params.medium) queryParts.push(`utm_medium=${params.medium}`);
  if (params.campaign) queryParts.push(`utm_campaign=${params.campaign}`);
  if (params.term) queryParts.push(`utm_term=${params.term}`);
  if (params.content) queryParts.push(`utm_content=${params.content}`);

  if (queryParts.length === 0) return destination;

  const separator = destination.includes("?") ? "&" : "?";
  return `${destination}${separator}${queryParts.join("&")}`;
}

export function getUtmPreviewSegments(params: UtmParams): UtmPreviewSegment[] {
  const destination = params.destination.trim();
  if (!destination) {
    return [{ text: "Enter a destination URL to preview your link", type: "base" }];
  }

  const segments: UtmPreviewSegment[] = [{ text: destination, type: "base" }];

  const paramEntries: Array<{ key: string; value: string }> = [
    { key: "utm_source", value: params.source },
    { key: "utm_medium", value: params.medium },
    { key: "utm_campaign", value: params.campaign },
    { key: "utm_term", value: params.term },
    { key: "utm_content", value: params.content },
  ].filter((entry) => entry.value.length > 0);

  if (paramEntries.length === 0) return segments;

  segments.push({
    text: destination.includes("?") ? "&" : "?",
    type: "separator",
  });

  paramEntries.forEach((entry, index) => {
    if (index > 0) {
      segments.push({ text: "&", type: "separator" });
    }
    segments.push({ text: `${entry.key}=`, type: "param" });
    segments.push({ text: entry.value, type: "value" });
  });

  return segments;
}
