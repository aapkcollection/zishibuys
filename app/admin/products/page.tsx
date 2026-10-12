
"use client";

import { useState } from "react";
import Link from "next/link";

type Product = {
  asin: string;
  title?: string;
  brand?: string;
  imageUrl?: string;
  price?: string;
  affiliateUrl: string;
};

export default function ProductsPage() {
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState<Product | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

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
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Product fetch nahi hua.");
      }

      setProduct(data.product);
      setMessage(data.message || "Product details mil gayi hain.");
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Kuch ghalat ho gaya. Dobara try karo."
      );
    } finally {
      setLoading(false);
    }
  }

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
      <p>Amazon product link paste karo aur details fetch karo.</p>

      <label htmlFor="amazon-url">Amazon Product URL</label>
      <input
        id="amazon-url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://www.amazon.com/dp/ASIN"
        style={{
          display: "block",
          width: "100%",
          padding: 13,
          margin: "10px 0",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={fetchProduct}
        disabled={loading}
        style={{
          padding: "12px 20px",
          background: "#f59e0b",
          border: 0,
          borderRadius: 8,
          cursor: loading ? "wait" : "pointer",
        }}
      >
        {loading ? "Fetching..." : "Fetch Product"}
      </button>

      {message && <p role="status">{message}</p>}

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
              style={{ maxWidth: 200, maxHeight: 200, objectFit: "contain" }}
            />
          )}

          <h2>{product.title || "Product title unavailable"}</h2>
          {product.brand && <p>Brand: {product.brand}</p>}
          {product.price && <p>Price: {product.price}</p>}
          <p>ASIN: {product.asin}</p>

          <a href={product.affiliateUrl} target="_blank" rel="noreferrer">
            Check Price on Amazon
          </a>
        </section>
      )}
    </main>
  );
}
