import Link from "next/link";

const cardStyle = {
  display: "block",
  background: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  textDecoration: "none",
  color: "#111827",
};

export default function AdminPage() {
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
        <h1>ZishiBuys Admin Dashboard</h1>

        <p style={{ color: "#4b5563" }}>
          Manage your ZishiBuys store from one place.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          <Link href="/admin/products" style={cardStyle}>
            <h2>📦 Products</h2>
            <p>Add and manage store products.</p>
            <strong style={{ color: "#ea580c" }}>
              Open Products →
            </strong>
          </Link>

          <div style={cardStyle}>
            <h2>🎬 AI Videos</h2>
            <p>Video tools will be added next.</p>
          </div>

          <div style={cardStyle}>
            <h2>📱 Social Media</h2>
            <p>Social account integration comes later.</p>
          </div>

          <div style={cardStyle}>
            <h2>📊 Analytics</h2>
            <p>Visitor and product-click tracking comes later.</p>
          </div>
        </div>

        <section
          style={{
            ...cardStyle,
            marginTop: "24px",
          }}
        >
          <h2>Admin Panel</h2>
          <p>Open your existing admin login page.</p>

          <Link
            href="/admin/login"
            style={{
              display: "inline-block",
              marginTop: "12px",
              padding: "12px 20px",
              background: "#ea580c",
              color: "#fff",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Go to Admin Login
          </Link>
        </section>
      </div>
    </main>
  );
}
