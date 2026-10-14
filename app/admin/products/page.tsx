
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  asin: string;
  title?: string;
  brand?: string;
  imageUrl?: string;
  images?: string[];
  price?: string;
  currency?: string;
  description?: string;
  affiliateUrl: string;
  amazonUrl?: string;
};

type Category = {
  id: string;
  name: string;
};

async function readResponse(response: Response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    throw new Error(
      response.status === 404
        ? "API route nahi mili (404). Deployment aur API file path check karo."
        : `Server ne JSON ki jagah HTML/text bheja (HTTP ${response.status}). Vercel deployment aur API route check karo.`
    );
  }
}

export default function ProductsPage() {
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      try {
        const response = await fetch("/api/admin/categories", {
          cache: "no-store",
        });
        const data = await readResponse(response);

        if (!response.ok) {
          throw new Error(
            data.message || data.error || "Categories load nahi hui."
          );
        }

        const list = Array.isArray(data)
          ? data
          : data.categories ?? data.data ?? [];

        if (active && Array.isArray(list)) {
          setCategories(list);
        }
      } catch (error) {
        if (active) {
          setMessage(
            error instanceof Error
              ? `Category loading: ${error.message}`
              : "Categories load nahi hui."
          );
        }
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  async function fetchProduct() {
    setMessage("");
    setProduct(null);

    if (!url.trim()) {
      setMessage("Pehle Amazon product link paste karo.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/products/fetch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data.error || data.message || `Product fetch fail hui (HTTP ${response.status}).`
        );
      }

      if (!data.product) {
        throw new Error("API response mein product details nahi milin.");
      }

      setProduct(data.product);
      setMessage(data.message || "Product details mil gayi hain.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Product fetch nahi hua. Dobara try karo."
      );
    } finally {
      setLoading(false);
    }
  }

  async function saveProduct() {
    if (!product) return;

    if (!categoryId) {
      setMessage("Product save karne se pehle category select karo.");
      return;
    }

    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: product.title || `Amazon Product ${product.asin}`,
          description: product.description || "",
          amazonUrl: product.amazonUrl || product.affiliateUrl,
          affiliateUrl: product.affiliateUrl,
          imageUrl: product.imageUrl,
          price: product.price,
          currency: product.currency || "USD",
          asin: product.asin,
          categoryId,
          published: true,
        }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data.message || data.error || `Product save fail hui (HTTP ${response.status}).`
        );
      }

      setMessage(data.message || "Product database mein save ho gaya!");
      setProduct(null);
      setUrl("");
      setCategoryId("");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Product save nahi hua."
      );
    } finally {
      setSaving(false);
    }
  }

  const styles = {
    input: {
      display: "block",
      width: "100%",
      padding: 12,
      margin: "8px 0 14px",
      boxSizing: "border-box" as const,
      border: "1px solid #ccc",
      borderRadius: 8,
    },
    button: {
      padding: "12px 18px",
      background: "#f59e0b",
      color: "#111",
      border: 0,
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 600,
    },
  };

  return (
    <main
      style={{
        maxWidth: 850,
        margin: "0 auto",
        padding: 24,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <Link href="/admin">← Back to Dashboard</Link>

      <h1>Amazon Product Import</h1>
      <p>Amazon.com product link paste karo aur details fetch karo.</p>

      <label htmlFor="amazon-url">Amazon Product URL</label>
      <input
        id="amazon-url"
        type="url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="https://www.amazon.com/dp/ASIN"
        style={styles.input}
      />

      <button
        onClick={fetchProduct}
        disabled={loading}
        style={styles.button}
      >
        {loading ? "Fetching..." : "Fetch Product"}
      </button>

      {message && (
        <p
          role="status"
          style={{ overflowWrap: "anywhere", marginTop: 16 }}
        >
          {message}
        </p>
      )}

      {product && (
        <section
          style={{
            marginTop: 24,
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: 12,
          }}
        >
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.title || "Amazon product"}
              style={{
                maxWidth: 220,
                maxHeight: 220,
                objectFit: "contain",
              }}
            />
          )}

          <h2>{product.title || "Product title unavailable"}</h2>

          {product.brand && <p>Brand: {product.brand}</p>}

          {product.price && (
            <p>Price: {product.currency || "USD"} {product.price}</p>
          )}

          <p>ASIN: {product.asin}</p>

          {product.description && (
            <p style={{ whiteSpace: "pre-line" }}>
              {product.description}
            </p>
          )}

          {Array.isArray(product.images) &&
            product.images.length > 1 && (
              <p>{product.images.length} product images available.</p>
            )}

          <p>
            <a
              href={product.affiliateUrl}
              target="_blank"
              rel="noreferrer"
            >
              Check Price on Amazon
            </a>
          </p>

          <label htmlFor="category">Apni existing category select karo</label>
          <select
            id="category"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            style={styles.input}
          >
            <option value="">Select category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          {categories.length === 0 && (
            <p>
              Categories load nahi hui hain. Category API ka route check
              karna hoga; abhi product save mat karo.
            </p>
          )}

          <button
            onClick={saveProduct}
            disabled={saving || categories.length === 0 || !categoryId}
            style={{
              ...styles.button,
              background: "#16a34a",
              color: "#fff",
              cursor:
                saving || categories.length === 0 || !categoryId
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {saving ? "Saving..." : "Import Product"}
          </button>
        </section>
      )}
    </main>
  );
}
