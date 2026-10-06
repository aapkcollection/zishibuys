
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
        setError(data.message || "Login failed.");
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
        background:
          "linear-gradient(135deg, #fff7ed 0%, #ffffff 45%, #fff1f2 100%)",
        padding: "20px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          background: "#ffffff",
          borderRadius: "22px",
          padding: "32px",
          boxSizing: "border-box",
          boxShadow: "0 20px 60px rgba(0,0,0,0.10)",
          border: "1px solid #f1f1f1",
        }}
      >
        {/* Logo */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "28px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "17px",
              background:
                "linear-gradient(135deg, #ff4d2d, #ff6a00)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
              fontSize: "30px",
              fontWeight: 900,
              boxShadow: "0 10px 25px rgba(255,77,45,0.25)",
            }}
          >
            Z
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: 800,
              color: "#171717",
            }}
          >
            ZishiBuys Admin
          </h1>

          <p
            style={{
              margin: "8px 0 0",
              color: "#777777",
              fontSize: "14px",
            }}
          >
            Secure administrator login
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 700,
              marginBottom: "8px",
              color: "#333333",
            }}
          >
            Admin Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="admin@example.com"
            autoComplete="email"
            required
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px 15px",
              borderRadius: "12px",
              border: "1px solid #dddddd",
              outline: "none",
              fontSize: "15px",
              marginBottom: "18px",
            }}
          />

          <label
            htmlFor="password"
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 700,
              marginBottom: "8px",
              color: "#333333",
            }}
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter your password"
            autoComplete="current-password"
            required
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "14px 15px",
              borderRadius: "12px",
              border: "1px solid #dddddd",
              outline: "none",
              fontSize: "15px",
              marginBottom: "18px",
            }}
          />

          {error && (
            <div
              style={{
                background: "#fff1f2",
                border: "1px solid #fecdd3",
                color: "#be123c",
                padding: "12px",
                borderRadius: "10px",
                fontSize: "14px",
                marginBottom: "16px",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "12px",
              padding: "15px",
              background: loading
                ? "#aaaaaa"
                : "linear-gradient(135deg, #ff4d2d, #ff6a00)",
              color: "#ffffff",
              fontSize: "16px",
              fontWeight: 800,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading
                ? "none"
                : "0 10px 25px rgba(255,77,45,0.20)",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Footer */}
        <div
          style={{
            marginTop: "24px",
            paddingTop: "18px",
            borderTop: "1px solid #eeeeee",
            textAlign: "center",
            color: "#999999",
            fontSize: "12px",
          }}
        >
          ZishiBuys • Secure Admin Panel
        </div>
      </div>
    </main>
  );
}
