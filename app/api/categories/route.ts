
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const sessionToken = (await import("next/headers")).cookies;

    const cookieStore = await sessionToken();
    const session = cookieStore.get("zishi_admin_session")?.value;

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Admin login required" },
        { status: 401 }
      );
    }

    const verified = await verifySession(session);

    if (!verified) {
      return NextResponse.json(
        { success: false, message: "Invalid admin session" },
        { status: 401 }
      );
    }

    const categories = await prisma.category.findMany({
      where: { published: true },
      select: {
        id: true,
        name: true,
      },
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Admin categories API error:", error);

    return NextResponse.json(
      { success: false, message: "Categories load nahi ho sakin" },
      { status: 500 }
    );
  }
}
