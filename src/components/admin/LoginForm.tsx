"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email"), password: form.get("password") }),
    });
    const result = await response.json();
    if (!response.ok) {
      setError(result.error ?? "Unable to sign in.");
      setLoading(false);
      return;
    }
    router.replace("/admin");
    router.refresh();
  }
  return (
    <form className="login-form" onSubmit={submit}>
      <div className="login-icon"><LockKeyhole /></div>
      <span>SECURE CMS</span>
      <h1>Welcome back.</h1>
      <p>Sign in to manage Canam Facility Services.</p>
      <label>Email<input name="email" type="email" required autoComplete="email" /></label>
      <label>Password<input name="password" type="password" required minLength={8} autoComplete="current-password" /></label>
      {error && <div className="admin-error" role="alert">{error}</div>}
      <button className="admin-primary" disabled={loading}>{loading ? "Signing in…" : "Sign in"}<ArrowRight /></button>
    </form>
  );
}
