import { NextResponse } from "next/server";

const categories = [
  {
    id: "home-kitchen",
    name: "Home & Kitchen",
    slug: "home-kitchen",
  },
  {
    id: "electronics",
    name: "Electronics",
    slug: "electronics",
  },
  {
    id: "beauty-personal-care",
    name: "Beauty & Personal Care",
    slug: "beauty-personal-care",
  },
  {
    id: "fashion",
    name: "Fashion",
    slug: "fashion",
  },
  {
    id: "health-fitness",
    name: "Health & Fitness",
    slug: "health-fitness",
  },
  {
    id: "tools-garden",
    name: "Tools & Garden",
    slug: "tools-garden",
  },
  {
    id: "office-stationery",
    name: "Office & Stationery",
    slug: "office-stationery",
  },
  {
    id: "pet-supplies",
    name: "Pet Supplies",
    slug: "pet-supplies",
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    categories,
  });
}
