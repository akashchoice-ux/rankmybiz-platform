import Link from "next/link";
import Logo from "@/app/components/brand/Logo";
import RegisterForm from "./RegisterForm";
import { PACKAGES } from "@/lib/constants";

export const metadata = {
  title: "Create Account — RankMyBiz",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function RegisterPage({ searchParams }: Props) {
  const params = await searchParams;
  const selectedPackage = params?.package as string | undefined;

  const pkg = PACKAGES.find((p) => p.slug === selectedPackage);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <div className="px-6 py-5 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Logo />
        <p className="text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-brand font-semibold hover:underline">
            Log in
          </Link>
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {pkg && (
            <div className="bg-brand-light border border-indigo-200 rounded-xl px-4 py-3 mb-5 flex items-center gap-3">
              <svg
                className="w-5 h-5 text-brand shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-brand font-medium">
                You&apos;ve selected the <strong>{pkg.name}</strong> plan —
                RM{pkg.price}/month
              </p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Create your account
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Set up your RankMyBiz account in seconds.
              </p>
            </div>
            <RegisterForm selectedPackage={selectedPackage} />
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            By creating an account, you agree to our{" "}
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
