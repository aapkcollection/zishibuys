
import { NextResponse } from "next/server";

function getAmazonAsin(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase().replace(/^www\./, "");

    if (
      !(
        host === "amazon.com" ||
        host.endsWith(".amazon.com") ||
        /^amazon\.[a-z.]+$/.test(host) ||
        /^amzn\.to$/.test(host)
      )
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const url = typeof body.url === "string" ? body.url.trim() : "";

    const asin = getAmazonAsin(url);

    if (!asin) {
      return NextResponse.json(
        {
          error:
            "Valid Amazon product URL paste karo. Short amzn.to links abhi supported nahi hain.",
        },
        { status: 400 }
      );
    }

    if (
      !process.env.AMAZON_CREATORS_CREDENTIAL_ID ||
      !process.env.AMAZON_CREATORS_CREDENTIAL_SECRET ||
      !process.env.AMAZON_PARTNER_TAG
    ) {
      return NextResponse.json(
        {
          error:
            `ASIN ${asin} mil gaya. Real product details fetch karne ke liye Amazon Creators API access aur server-side credentials configure karne honge.`,
        },
        { status: 503 }
      );
    }

    // Next step: official Amazon Creators API GetItems integration.
    // Credentials alone are not enough; the API request must use
    // the correct regional token endpoint, version and marketplace.

    return NextResponse.json(
      {
        error:
          "ASIN mil gaya, lekin Creators API GetItems integration abhi add karni hai.",
        asin,
      },
      { status: 501 }
    );
  } catch {
    return NextResponse.json(
      { error: "Request process nahi ho saki." },
      { status: 400 }
    );
  }
}
