
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(result.error || "Invalid email or password.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="login-background">
      <section className="login-card">
        <div className="brand-logo">Z</div>

        <h1>ZishiBuys Admin</h1>
        <p className="subtitle">Secure administrator login</p>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Admin Email</label>
          <input
            id="email"
            type="email"
            placeholder="admin@example.com"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          <div className="forgot-row">
            <Link href="/admin/forgot-password">
              Forgot password?
            </Link>
          </div>

          {error && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <footer>ZishiBuys • Secure Admin Panel</footer>
      </section>

      <style jsx>{`
        .login-background {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          padding: 24px;
          background:
            radial-gradient(
              circle at 15% 15%,
              rgba(255, 218, 198, 0.55),
              transparent 38%
            ),
            linear-gradient(135deg, #fff8f5 0%, #fff0f5 100%);
          font-family: Arial, Helvetica, sans-serif;
        }

        .login-card {
          width: 100%;
          max-width: 410px;
          box-sizing: border-box;
          padding: 36px 32px 24px;
          background: #fff;
          border: 1px solid rgba(245, 120, 74, 0.12);
          border-radius: 22px;
          box-shadow: 0 18px 55px rgba(110, 62, 49, 0.1);
        }

        .brand-logo {
          width: 58px;
          height: 58px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 18px;
          border-radius: 17px;
          background: linear-gradient(135deg, #ff9b45, #f15a29);
          color: #fff;
          font-size: 32px;
          font-weight: 800;
          box-shadow: 0 8px 18px rgba(241, 90, 41, 0.22);
        }

        h1 {
          margin: 0;
          color: #252525;
          text-align: center;
          font-size: 25px;
          font-weight: 750;
          letter-spacing: -0.7px;
        }

        .subtitle {
          margin: 9px 0 30px;
          color: #85818a;
          text-align: center;
          font-size: 14px;
        }

        label {
          display: block;
          margin: 0 0 8px;
          color: #37333a;
          font-size: 13px;
          font-weight: 650;
        }

        input {
          width: 100%;
          height: 48px;
          box-sizing: border-box;
          margin-bottom: 20px;
          padding: 0 14px;
          border: 1px solid #e9e5e8;
          border-radius: 10px;
          outline: none;
          background: #fff;
          color: #29252b;
          font-size: 14px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        input:focus {
          border-color: #f5824b;
          box-shadow: 0 0 0 3px rgba(245, 130, 75, 0.12);
        }

        .forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -9px;
          margin-bottom: 22px;
        }

        .forgot-row a {
          color: #ed6c37;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
        }

        .forgot-row a:hover {
          text-decoration: underline;
        }

        button {
          width: 100%;
          min-height: 49px;
          border: none;
          border-radius: 11px;
          background: linear-gradient(100deg, #ff9847, #f15b2a);
          color: #fff;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 7px 16px rgba(241, 91, 42, 0.19);
          transition: opacity 0.2s, transform 0.2s;
        }

        button:hover:not(:disabled) {
          transform: translateY(-1px);
        }

        button:disabled {
          opacity: 0.65;
          cursor: wait;
        }

        .error-message {
          margin: -7px 0 16px;
          color: #c62828;
          font-size: 13px;
          line-height: 1.5;
        }

        footer {
          margin-top: 27px;
          padding-top: 20px;
          border-top: 1px solid #f0edef;
          color: #9a949b;
          text-align: center;
          font-size: 12px;
        }

        @media (max-width: 480px) {
          .login-card {
            padding: 30px 23px 22px;
          }

          h1 {
            font-size: 23px;
          }
        }
      `}</style>
    </main>
  );
}
