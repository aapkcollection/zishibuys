"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
const router = useRouter();
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault();
setError("");
setLoading(true);

try {
  const response = await fetch("/api/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email.trim().toLowerCase(),
      password,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.success) {
    setError(data.message || "Login failed. Check your email and password.");
    return;
  }

  router.replace("/admin");
  router.refresh();
} catch {
  setError("Unable to connect. Please try again.");
} finally {
  setLoading(false);
}

}

return (
<main
style={{
minHeight: "100vh",
display: "flex",
alignItems: "center",
justifyContent: "center",
padding: "20px",
background: "linear-gradient(135deg, #fff7ed, #ffffff, #fff1f2)",
fontFamily: "Arial, Helvetica, sans-serif",
}}
>
<form
onSubmit={handleSubmit}
style={{
width: "100%",
maxWidth: "420px",
padding: "32px",
background: "#ffffff",
border: "1px solid #e5e7eb",
borderRadius: "18px",
boxShadow: "0 15px 45px rgba(0,0,0,0.08)",
boxSizing: "border-box",
}}
>
<div style={{ textAlign: "center", marginBottom: "28px" }}>
<h1 style={{ color: "#ea580c", marginBottom: "8px" }}>
ZishiBuys
</h1>
<h2 style={{ color: "#111827", marginBottom: "8px" }}>
Admin Login
</h2>
<p style={{ color: "#6b7280", fontSize: "14px" }}>
Sign in to manage your store
</p>
</div>

    <label
      htmlFor="email"
      style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}
    >
      Email address
    </label>
    <input
      id="email"
      type="email"
      autoComplete="username"
      required
      value={email}
      onChange={(event) => setEmail(event.target.value)}
      placeholder="admin@example.com"
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "13px",
        marginBottom: "20px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "16px",
      }}
    />

    <label
      htmlFor="password"
      style={{ display: "block", marginBottom: "8px", fontWeight: 600 }}
    >
      Password
    </label>
    <input
      id="password"
      type="password"
      autoComplete="current-password"
      required
      value={password}
      onChange={(event) => setPassword(event.target.value)}
      placeholder="Enter your password"
      style={{
        width: "100%",
        boxSizing: "border-box",
        padding: "13px",
        marginBottom: "20px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "16px",
      }}
    />

    {error && (
      <p
        role="alert"
        style={{
          color: "#b91c1c",
          background: "#fef2f2",
          padding: "12px",
          borderRadius: "8px",
          fontSize: "14px",
        }}
      >
        {error}
      </p>
    )}

    <button
      type="submit"
      disabled={loading}
      style={{
        width: "100%",
        padding: "14px",
        background: loading ? "#9ca3af" : "#ea580c",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        fontWeight: 700,
        fontSize: "16px",
        cursor: loading ? "wait" : "pointer",
      }}
    >
      {loading ? "Signing in..." : "Sign In"}
    </button>

    <p
      style={{
        textAlign: "center",
        marginTop: "22px",
        color: "#9ca3af",
        fontSize: "12px",
      }}
    >
      ZishiBuys Admin Panel
    </p>
  </form>
</main>

);
}
