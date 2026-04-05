"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Invalid email or password.");
        return;
      }

      // Redirect admin to /admin, SME to /dashboard (or the originally requested page)
      if (data.user?.role === "admin") {
        router.push(redirect.startsWith("/admin") ? redirect : "/admin");
      } else {
        router.push(redirect);
      }
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="bg-danger-light border border-red-200 text-danger text-sm rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-700">
            Password <span className="text-danger">*</span>
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-xs text-brand hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </div>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 hover:border-slate-300 focus:outline-2 focus:outline-offset-0 focus:outline-brand transition-colors"
        />
      </div>

      <Button
        type="submit"
        isLoading={isLoading}
        fullWidth
        size="lg"
        className="mt-1"
      >
        Log In
      </Button>
    </form>
  );
}
