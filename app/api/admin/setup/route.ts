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
      return NextResponse
