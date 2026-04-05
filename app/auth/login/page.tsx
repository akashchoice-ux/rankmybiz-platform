import Link from "next/link";
import Logo from "@/app/components/brand/Logo";
import LoginForm from "./LoginForm";

export const metadata = {
  title: "Log In — RankMyBiz",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <div className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Logo />
        <p className="text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="text-brand font-semibold hover:underline">
            Sign up
          </Link>
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Welcome back
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Log in to your RankMyBiz account
              </p>
            </div>
            <LoginForm />
          </div>
          <p className="text-center text-xs text-slate-400 mt-6">
            By continuing, you agree to our{" "}
            <Link href="#" className="underline hover:text-slate-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-slate-600">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
