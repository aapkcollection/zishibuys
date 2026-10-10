
import Link from "next/link";

export default function ProductsPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px",
        background: "#f8fafc",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <Link href="/admin">← Back to Dashboard</Link>

        <h1 style={{ color: "#111827" }}>
          Products Management
        </h1>

        <p style={{ color: "#4b5563" }}>
          Manage your ZishiBuys store products.
        </p>

        <section
          style={{
            background: "#fff",
            padding: "24px",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            marginTop: "24px",
          }}
        >
          <h2>Your Products</h2>
          <p>
            Your product management area is ready
            for the next integration step.
          </p>
          <p>
            Next, we will connect products to your
            database and add product creation,
            editing, and Amazon affiliate links.
          </p>
        </section>
      </div>
    </main>
  );
}
