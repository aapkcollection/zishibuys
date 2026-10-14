
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Product = {
  asin: string;
  title?: string;
  brand?: string;
  imageUrl?: string;
  images?: { url: string }[];
  price?: string;
  currency?: string;
  description?: string;
  affiliateUrl?: string;
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
        : `Server response samajh nahi aaya (HTTP ${response.status}).`
    );
  }
}

export default function ProductsPage() {
  const [url, setUrl] = useState("");
  const [affiliateUrl, setAffiliateUrl] = useState("");
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
          if (list.length === 0) {
            setMessage("Abhi koi category available nahi hai.");
          }
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
          data.error ||
            data.message ||
            `Product fetch fail hui (HTTP ${response.status}).`
        );
      }

      if (!data.product) {
        throw new Error("Product details response mein nahi milin.");
      }

      setProduct(data.product);
      setAffiliateUrl("");
      setMessage(
        data.message || "Details mil gayi hain. Apna affiliate link add karo."
      );
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

    if (!affiliateUrl.trim()) {
      setMessage("Apna Amazon affiliate link paste karo.");
      return;
    }

    let affiliate: URL;

    try {
      affiliate = new URL(affiliateUrl.trim());
    } catch {
      setMessage("Affiliate link valid URL nahi hai.");
      return;
    }

    const host = affiliate.hostname.toLowerCase();
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

    if (affiliate.protocol !== "https:" || !isAmazonHost) {
      setMessage("HTTPS Amazon affiliate link use karo.");
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
          amazonUrl: product.amazonUrl || url.trim(),
          affiliateUrl: affiliate.href,
          imageUrl: product.imageUrl || "",
          price: product.price || "",
          currency: product.currency || "USD",
          asin: product.asin,
          categoryId,
          published: true,
        }),
      });

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data.message ||
            data.error ||
            `Product save fail hui (HTTP ${response.status}).`
        );
      }

      setMessage(data.message || "Product successfully save ho gaya!");
      setProduct(null);
      setUrl("");
      setAffiliateUrl("");
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
      fontSize: 15,
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

      <h1>Add Amazon Product</h1>
      <p>
        Product link fetch karo, category select karo aur apna affiliate
        button link add karke save karo.
      </p>

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
        style={{
          ...styles.button,
          opacity: loading ? 0.6 : 1,
        }}
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
            <p>
              Price: {product.currency || "USD"} {product.price}
            </p>
          )}

          <p>ASIN: {product.asin}</p>

          {product.description && (
            <p style={{ whiteSpace: "pre-line" }}>
              {product.description}
            </p>
          )}

          <hr style={{ margin: "24px 0" }} />

          <label htmlFor="category">
            Product kis category mein list karna hai?
          </label>
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
              Categories load nahi hui. Category API check karni hogi.
            </p>
          )}

          <label htmlFor="affiliate-url">
            Your Amazon Affiliate Link
          </label>
          <input
            id="affiliate-url"
            type="url"
            value={affiliateUrl}
            onChange={(event) => setAffiliateUrl(event.target.value)}
            placeholder="https://www.amazon.com/dp/ASIN?tag=yourtag-20"
            style={styles.input}
          />

          <p style={{ fontSize: 13, color: "#666" }}>
            Website ka “Check Price on Amazon” button isi link ko use
            karega.
          </p>

          <button
            onClick={saveProduct}
            disabled={saving || categories.length === 0 || !categoryId}
            style={{
              ...styles.button,
              background: "#16a34a",
              color: "#fff",
              opacity:
                saving || categories.length === 0 || !categoryId
                  ? 0.6
                  : 1,
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
