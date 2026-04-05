"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/app/components/ui/Input";
import Button from "@/app/components/ui/Button";

interface RegisterFormProps {
  selectedPackage?: string;
}

export default function RegisterForm({ selectedPackage }: RegisterFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm_password) {
      setError("Passwords don't match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Supabase auth.signUp with full_name in user_metadata
      await new Promise((res) => setTimeout(res, 1000)); // placeholder
      router.push(
        selectedPackage
          ? `/dashboard/submit?package=${selectedPackage}`
          : "/dashboard/submit"
      );
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
        label="Full name"
        type="text"
        placeholder="Ahmad bin Abdullah"
        value={form.full_name}
        onChange={(e) => update("full_name", e.target.value)}
        required
        autoComplete="name"
      />

      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={(e) => update("email", e.target.value)}
        required
        autoComplete="email"
      />

      <Input
        label="Password"
        type="password"
        placeholder="At least 8 characters"
        value={form.password}
        onChange={(e) => update("password", e.target.value)}
        required
        autoComplete="new-password"
        hint="Minimum 8 characters"
      />

      <Input
        label="Confirm password"
        type="password"
        placeholder="Repeat your password"
        value={form.confirm_password}
        onChange={(e) => update("confirm_password", e.target.value)}
        required
        autoComplete="new-password"
      />

      <Button
        type="submit"
        isLoading={isLoading}
        fullWidth
        size="lg"
        className="mt-1"
      >
        Create Account
      </Button>
    </form>
  );
}
