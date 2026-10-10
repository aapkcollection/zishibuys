import Link from "next/link";

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
<h1 style={{ color: "#111827" }}>
ZishiBuys Admin Dashboard
</h1>

    <p style={{ color: "#4b5563" }}>
      Welcome to your store administration panel.
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
      <h2>Admin Panel</h2>
      <p>Manage your ZishiBuys store.</p>

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
