
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MARKETPLACE = "www.amazon.com";

function getAmazonAsin(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");

    if (
      host !== "amazon.com" &&
      !host.endsWith(".amazon.com")
    ) {
      return null;
    }

    const match = url.pathname.match(
      /\/(?:dp|gp\/product|exec\/obidos\/ASIN)\/([A-Z0-9]{10})/i
    );

    return match?.[1]?.toUpperCase() ?? null;
  } catch {
    return null;
  }
}

function getText(value: any): string | undefined {
  if (typeof value === "string") return value;
  if (typeof value?.displayValue === "string") {
    return value.displayValue;
  }
  return undefined;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = typeof body?.url === "string" ? body.url.trim() : "";

    if (!url) {
      return NextResponse.json(
        { error: "Amazon product link paste karo." },
        { status: 400 }
      );
    }

    const asin = getAmazonAsin(url);

    if (!asin) {
      return NextResponse.json(
        {
          error:
            "Valid Amazon.com product link do, jaise https://www.amazon.com/dp/B0XXXXXXXX.",
        },
        { status: 400 }
      );
    }

    const clientId = process.env.AMAZON_CREATORS_CREDENTIAL_ID;
    const clientSecret = process.env.AMAZON_CREATORS_CREDENTIAL_SECRET;
    const partnerTag = process.env.AMAZON_PARTNER_TAG;

    if (!clientId || !clientSecret || !partnerTag) {
      return NextResponse.json(
        {
          error:
            "Amazon API credentials missing hain. Vercel Environment Variables check karke Redeploy karo.",
        },
        { status: 503 }
      );
    }

    // Step 1: Get Amazon Creators API access token.
    const tokenResponse = await fetch(
      "https://api.amazon.com/auth/o2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grant_type: "client_credentials",
          client_id: clientId,
          client_secret: clientSecret,
          scope: "creatorsapi::default",
        }),
        cache: "no-store",
      }
    );

    const tokenData = await tokenResponse.json().catch(() => ({}));

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error("Amazon token request failed:", tokenResponse.status);

      return NextResponse.json(
        {
          error:
            "Amazon authentication fail hui. Credentials, credential region/version aur Creators API access check karo.",
        },
        { status: 502 }
      );
    }

    // Step 2: Fetch product details from Amazon.
    const amazonResponse = await fetch(
      "https://creatorsapi.amazon/catalog/v1/getItems",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
          "x-marketplace": MARKETPLACE,
        },
        body: JSON.stringify({
          itemIds: [asin],
          itemIdType: "ASIN",
          marketplace: MARKETPLACE,
          partnerTag,
          resources: [
            "images.primary.large",
            "images.primary.medium",
            "images.variants.large",
            "itemInfo.title",
            "itemInfo.features",
            "itemInfo.byLineInfo",
            "itemInfo.productInfo",
            "browseNodeInfo.browseNodes",
            "offersV2.listings.price",
            "offersV2.listings.availability",
          ],
        }),
        cache: "no-store",
      }
    );

    const amazonData = await amazonResponse.json().catch(() => ({}));

    if (!amazonResponse.ok) {
      console.error("Amazon GetItems failed:", amazonResponse.status);

      return NextResponse.json(
        {
          error:
            amazonResponse.status === 401 ||
            amazonResponse.status === 403
              ? "Amazon API access reject hui. Credentials, API approval aur US marketplace Partner Tag check karo."
              : `Amazon product request fail hui (HTTP ${amazonResponse.status}). Dobara try karo.`,
        },
        { status: 502 }
      );
    }

    const item =
      amazonData?.itemsResult?.items?.[0] ??
      amazonData?.itemsResult?.itemResults?.[0] ??
      amazonData?.items?.[0];

    if (!item) {
      const apiError =
        amazonData?.errors?.[0]?.message ??
        amazonData?.itemsResult?.errors?.[0]?.message;

      return NextResponse.json(
        {
          error: apiError
            ? `Amazon product nahi mila: ${apiError}`
            : "Amazon ne is ASIN ke liye product details return nahi ki. ASIN aur API access check karo.",
        },
        { status: 404 }
      );
    }

    const title =
      getText(item?.itemInfo?.title) ??
      getText(item?.itemInfo?.title?.displayValue);

    const brand =
      getText(item?.itemInfo?.byLineInfo?.brand) ??
      getText(item?.itemInfo?.byLineInfo?.manufacturer);

    const imageUrl =
      item?.images?.primary?.large?.url ??
      item?.images?.primary?.medium?.url ??
      item?.images?.primary?.small?.url;

    const variantImages = Array.isArray(item?.images?.variants)
      ? item.images.variants
          .map((image: any) => image?.large?.url ?? image?.medium?.url ?? image?.small?.url)
          .filter((image: unknown): image is string => typeof image === "string")
      : [];

    const images = Array.from(
      new Set(
        [imageUrl, ...variantImages].filter(
          (image): image is string => typeof image === "string"
        )
      )
    );

    const features = item?.itemInfo?.features?.displayValues;
    const description = Array.isArray(features)
      ? features.filter((feature: unknown) => typeof feature === "string").join("\n")
      : "";

    const listing = item?.offersV2?.listings?.[0];
    const priceInfo = listing?.price?.money;

    const price =
      typeof priceInfo?.amount === "number"
        ? String(priceInfo.amount)
        : undefined;

    const currency =
      typeof priceInfo?.currency === "string"
        ? priceInfo.currency
        : "USD";

    const affiliateUrl =
      typeof item?.detailPageURL === "string"
        ? item.detailPageURL
        : `https://www.amazon.com/dp/${asin}?tag=${encodeURIComponent(partnerTag)}`;

    const category =
      item?.browseNodeInfo?.browseNodes?.[0]?.displayName;

    return NextResponse.json({
      message: "Amazon product details mil gayi hain.",
      product: {
        asin,
        title: title ?? "Product title unavailable",
        brand,
        imageUrl,
        images,
        price,
        currency,
        description,
        category:
          typeof category === "string" ? category : undefined,
        affiliateUrl,
        amazonUrl: `https://www.amazon.com/dp/${asin}`,
        video: null,
      },
    });
  } catch (error) {
    console.error(
      "Product fetch route error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    return NextResponse.json(
      { error: "Request process nahi ho saki. Dobara try karo." },
      { status: 500 }
    );
  }
}
