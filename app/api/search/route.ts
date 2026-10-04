import { NextRequest, NextResponse } from "next/server";
import { products } from "@/data/products";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q")?.trim().toLowerCase() || "";
  const category = searchParams.get("category")?.trim().toLowerCase() || "";

  const results = (products as any[]).filter((product) => {
    const name = String(product.name || "").toLowerCase();
    const description = String(product.description || "").toLowerCase();
    const productCategory = String(
      product.category || product.categoryName || ""
    ).toLowerCase();

    const matchesQuery =
      !query ||
      name.includes(query) ||
      description.includes(query) ||
      productCategory.includes(query);

    const matchesCategory =
      !category || productCategory === category;

    return matchesQuery && matchesCategory;
  });

  return NextResponse.json({
    success: true,
    query,
    category,
    count: results.length,
    products: results,
  });
}
