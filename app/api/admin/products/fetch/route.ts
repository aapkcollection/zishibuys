
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export const runtime = "nodejs";

function getAsin(url: URL): string | null {
  const match =
    url.pathname.match(/\/dp\/([A-Z0-9]{10})/i) ||
    url.pathname.match(/\/gp\/product\/([A-Z0-9]{10})/i);

  return match?.[1]?.toUpperCase() ?? null;
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("zishi_admin_session")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Admin login required." },
        { status: 401 }
      );
    }

    const adminId = await verifySession(token);

    if (!adminId) {
      return NextResponse.json(
        { success: false, error: "Invalid admin session." },
        { status: 401 }
      );
    }

    const admin = await prisma.admin.findFirst({
      where: { id: adminId, active: true },
      select: { id: true },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Admin access denied." },
        { status: 403 }
      );
    }

    let body: { url?: unknown };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Please provide a valid JSON body." },
        { status: 400 }
      );
    }

    if (typeof body.url !== "string" || !body.url.trim()) {
      return NextResponse.json(
        { success: false, error: "Amazon product URL is required." },
        { status: 400 }
      );
    }

    let productUrl: URL;

    try {
      productUrl = new URL(body.url.trim());
    } catch {
      return NextResponse.json(
        { success: false, error: "Enter a valid Amazon product URL." },
        { status: 400 }
      );
    }

    const host = productUrl.hostname.toLowerCase();
    const isAmazonHost =
      host === "amzn.to" ||
      host === "amazon.com" ||
      host.endsWith(".amazon.com") ||
      host === "amazon.co.uk" ||
      host.endsWith(".amazon.co.uk") ||
      host === "amazon.ca" ||
      host.endsWith(".amazon.ca") ||
      host === "amazon.com.au" ||
      host.endsWith(".amazon.com.au") ||
      host === "amazon.de" ||
      host.endsWith(".amazon.de") ||
      host === "amazon.fr" ||
      host.endsWith(".amazon.fr") ||
      host === "amazon.it" ||
      host.endsWith(".amazon.it") ||
      host === "amazon.es" ||
      host.endsWith(".amazon.es") ||
      host === "amazon.co.jp" ||
      host.endsWith(".amazon.co.jp") ||
      host === "amazon.in" ||
      host.endsWith(".amazon.in");

    if (productUrl.protocol !== "https:" || !isAmazonHost) {
      return NextResponse.json(
        { success: false, error: "Use a supported HTTPS Amazon URL." },
        { status: 400 }
      );
    }

    const asin = getAsin(productUrl);

    if (!asin) {
      return NextResponse.json(
        {
          success: false,
          error:
            "ASIN URL mein nahi mila. Amazon ka direct product link use karo, jaise amazon.com/dp/XXXXXXXXXX.",
        },
        { status: 400 }
      );
    }

    const credentialId =
      process.env.AMAZON_CREATORS_CREDENTIAL_ID;
    const credentialSecret =
      process.env.AMAZON_CREATORS_CREDENTIAL_SECRET;
    const partnerTag = process.env.AMAZON_PARTNER_TAG;

    if (!credentialId || !credentialSecret || !partnerTag) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Amazon API credentials configured nahi hain. Vercel Environment Variables check karo.",
        },
        { status: 503 }
      );
    }

    const tokenResponse = await fetch(
      "https://api.amazon.com/auth/o2/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "client_credentials",
          client_id: credentialId,
          client_secret: credentialSecret,
          scope: "creatorsapi::default",
        }),
        cache: "no-store",
      }
    );

    if (!tokenResponse.ok) {
      console.error(
        "Amazon token request failed:",
        tokenResponse.status
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Amazon authentication failed. Credentials aur API access check karo.",
        },
        { status: 502 }
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (typeof accessToken !== "string" || !accessToken) {
      return NextResponse.json(
        { success: false, error: "Amazon access token nahi mila." },
        { status: 502 }
      );
    }

    const marketplaceByHost: Record<string, string> = {
      "amazon.com": "www.amazon.com",
      "amazon.co.uk": "www.amazon.co.uk",
      "amazon.ca": "www.amazon.ca",
      "amazon.com.au": "www.amazon.com.au",
      "amazon.de": "www.amazon.de",
      "amazon.fr": "www.amazon.fr",
      "amazon.it": "www.amazon.it",
      "amazon.es": "www.amazon.es",
      "amazon.co.jp": "www.amazon.co.jp",
      "amazon.in": "www.amazon.in",
    };

    const marketplace =
      host === "amzn.to"
        ? "www.amazon.com"
        : marketplaceByHost[host] ||
          Object.entries(marketplaceByHost).find(
            ([domain]) => host.endsWith(`.${domain}`)
          )?.[1] ||
          "www.amazon.com";

    const apiResponse = await fetch(
      "https://creatorsapi.amazon/catalog/v1/getItems",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "x-marketplace": marketplace,
        },
        body: JSON.stringify({
          itemIds: [asin],
          partnerTag,
          partnerType: "Associates",
          resources: [
            "images.primary.large",
            "itemInfo.title",
            "itemInfo.byLineInfo",
            "itemInfo.features",
            "offersV2.listings.price",
          ],
        }),
        cache: "no-store",
      }
    );

    if (!apiResponse.ok) {
      console.error(
        "Amazon catalog request failed:",
        apiResponse.status,
        await apiResponse.text()
      );

      return NextResponse.json(
        {
          success: false,
          error:
            "Amazon product details nahi mil sake. API access, marketplace aur credentials check karo.",
        },
        { status: 502 }
      );
    }

    const result = await apiResponse.json();
    const item = result.items?.[0];

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: "Amazon ne is ASIN ke liye product return nahi kiya.",
        },
        { status: 404 }
      );
    }

    const name =
      item.itemInfo?.title?.displayValue || "";

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Amazon response mein product title nahi mila.",
        },
        { status: 502 }
      );
    }

    const imageUrl =
      item.images?.primary?.large?.url || "";

    const features =
      item.itemInfo?.features?.displayValues || [];

    const priceInfo =
      item.offersV2?.listings?.[0]?.price;

    const priceAmount = priceInfo?.amount;
    const price =
      typeof priceAmount === "number"
        ? priceAmount
        : typeof priceAmount === "string"
          ? Number(priceAmount)
          : undefined;

    const currency =
      typeof priceInfo?.currency === "string"
        ? priceInfo.currency
        : "USD";

    const product = {
      asin,
      title: name,
      brand:
        item.itemInfo?.byLineInfo?.brand?.displayValue || "",
      imageUrl,
      images: imageUrl ? [{ url: imageUrl }] : [],
      description: Array.isArray(features)
        ? features.join("\n")
        : "",
      price:
        typeof price === "number" && Number.isFinite(price)
          ? String(price)
          : "",
      currency,
      amazonUrl: productUrl.toString(),
      affiliateUrl: productUrl.toString(),
    };

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Admin product fetch error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Product fetch karte waqt server error aaya.",
      },
      { status: 500 }
    );
  }
}

