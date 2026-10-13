
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("zishi_admin_session")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Admin login required." },
        { status: 401 }
      );
    }

    const adminId = await verifySession(token);

    if (!adminId) {
      return NextResponse.json(
        { success: false, message: "Invalid admin session." },
        { status: 401 }
      );
    }

    const admin = await prisma.admin.findFirst({
      where: { id: adminId, active: true },
      select: { id: true },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin access denied." },
        { status: 403 }
      );
    }

    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        images: { orderBy: { sortOrder: "asc" } },
      },
    });

    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error("Admin products GET error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch products." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("zishi_admin_session")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Admin login required." },
        { status: 401 }
      );
    }

    const adminId = await verifySession(token);

    if (!adminId) {
      return NextResponse.json(
        { success: false, message: "Invalid admin session." },
        { status: 401 }
      );
    }

    const admin = await prisma.admin.findFirst({
      where: { id: adminId, active: true },
      select: { id: true },
    });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Admin access denied." },
        { status: 403 }
      );
    }

    let body: {
      name?: unknown;
      description?: unknown;
      amazonUrl?: unknown;
      affiliateUrl?: unknown;
      imageUrl?: unknown;
      price?: unknown;
      currency?: unknown;
      asin?: unknown;
      categoryId?: unknown;
      published?: unknown;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const name =
      typeof body.name === "string" ? body.name.trim() : "";

    const rawLink =
      typeof body.affiliateUrl === "string"
        ? body.affiliateUrl.trim()
        : typeof body.amazonUrl === "string"
          ? body.amazonUrl.trim()
          : "";

    if (!name || name.length > 200 || !rawLink) {
      return NextResponse.json(
        {
          success: false,
          message: "Valid product name and Amazon affiliate link are required.",
        },
        { status: 400 }
      );
    }

    let link: URL;

    try {
      link = new URL(rawLink);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid Amazon link." },
        { status: 400 }
      );
    }

    const host = link.hostname.toLowerCase();

    const allowedAmazonHost =
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

    if (link.protocol !== "https:" || !allowedAmazonHost) {
      return NextResponse.json(
        {
          success: false,
          message: "Use a supported HTTPS Amazon affiliate link.",
        },
        { status: 400 }
      );
    }

    const imageUrl =
      typeof body.imageUrl === "string" ? body.imageUrl.trim() : "";

    if (imageUrl) {
      try {
        const image = new URL(imageUrl);
        if (image.protocol !== "https:") throw new Error("Invalid image URL");
      } catch {
        return NextResponse.json(
          { success: false, message: "Image URL must use HTTPS." },
          { status: 400 }
        );
      }
    }

    let price: number | undefined;

    if (body.price !== undefined && body.price !== null && body.price !== "") {
      price = Number(body.price);

      if (!Number.isFinite(price) || price < 0) {
        return NextResponse.json(
          { success: false, message: "Price must be a valid non-negative number." },
          { status: 400 }
        );
      }
    }

    const categoryId =
      typeof body.categoryId === "string" && body.categoryId.trim()
        ? body.categoryId.trim()
        : undefined;

    if (categoryId) {
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
        select: { id: true },
      });

      if (!category) {
        return NextResponse.json(
          { success: false, message: "Selected category was not found." },
          { status: 400 }
        );
      }
    }

    const asin =
      typeof body.asin === "string" && body.asin.trim()
        ? body.asin.trim().toUpperCase()
        : null;

    if (asin && !/^[A-Z0-9]{10}$/.test(asin)) {
      return NextResponse.json(
        { success: false, message: "ASIN must contain 10 letters or numbers." },
        { status: 400 }
      );
    }

    if (asin) {
      const existing = await prisma.product.findUnique({
        where: { asin },
        select: { id: true },
      });

      if (existing) {
        return NextResponse.json(
          { success: false, message: "A product with this ASIN already exists." },
          { status: 409 }
        );
      }
    }

    const baseSlug =
      name
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 70) || "product";

    const slug = `${baseSlug}-${crypto.randomUUID().slice(0, 8)}`;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description:
          typeof body.description === "string"
            ? body.description.trim()
            : undefined,
        amazonUrl: rawLink,
        affiliateUrl: rawLink,
        price,
        currency:
          typeof body.currency === "string" &&
          /^[A-Z]{3}$/.test(body.currency.toUpperCase())
            ? body.currency.toUpperCase()
            : "USD",
        asin,
        categoryId,
        published: body.published === false ? false : true,
        importStatus: "MANUAL",
        images: imageUrl
          ? {
              create: {
                url: imageUrl,
                alt: name,
                sortOrder: 0,
              },
            }
          : undefined,
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product saved successfully.",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin products POST error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to save product." },
      { status: 500 }
    );
  }
}
