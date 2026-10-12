import Link from "next/link";

export default function ProductsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px",
        background: "#f8fafc",
        fontFamily: "Arial, sans-serif",
        color: "#111827",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Link
          href="/admin"
          style={{ color: "#ea580c", textDecoration: "none" }}
        >
          ← Back to Dashboard
        </Link>

        <h1>Products Management</h1>

        <p style={{ color: "#4b5563" }}>
          Manage your ZishiBuys store products.
        </p>

        <section
          style={{
            background: "#ffffff",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            marginTop: "24px",
          }}
        >
          <h2>Your Products</h2>

          <p>
            Your product management page is ready for integration.
          </p>

          <p>
            The next step is connecting the product database,
            product creation and editing, and affiliate links.
          </p>
        </section>
      </div>
    </main>
  );
}
