import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const setupSecret = process.env.ADMIN_SETUP_SECRET;

    if (!setupSecret) {
      return NextResponse.json(
        {
          success: false,
          message: "ADMIN_SETUP_SECRET is not configured.",
        },
        { status: 500 }
      );
    }

    const providedSecret = request.headers.get("x-setup-secret");

    if (!providedSecret || providedSecret !== setupSecret) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized setup request.",
        },
        { status: 401 }
      );
    }

    const existingAdmin = await prisma.admin.count();

    if (existingAdmin > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin setup has already been completed.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, email and password are required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 12) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 12 characters.",
        },
        { status: 400 }
      );
    }

    const passwordHash = await hashPassword(password);

    const admin = await prisma.admin.create({
      data: {
        name,
        email,
        passwordHash,
        role: "SUPER_ADMIN",
        active: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Admin account created successfully.",
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin setup error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to create admin account.",
      },
      { status: 500 }
    );
  }
}
