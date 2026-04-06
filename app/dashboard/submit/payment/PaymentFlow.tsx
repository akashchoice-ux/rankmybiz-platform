"use client";

import { useState } from "react";
import Card from "@/app/components/ui/Card";
import Button from "@/app/components/ui/Button";
import { BANK_TRANSFER_DETAILS, PACKAGES } from "@/lib/constants";
import { trackBankTransferSubmit } from "@/lib/analytics";

interface PaymentFlowProps {
  listingId?: string;
}

// Determine package from URL or default to Premium
const SELECTED_PACKAGE = PACKAGES.find((p) => p.id === "pkg_premium") ?? PACKAGES[1];

export default function PaymentFlow({ listingId }: PaymentFlowProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [uploaded, setUploaded] = useState(false);

  async function handleBankTransferSubmit() {
    if (!proofFile) return;
    setIsProcessing(true);
    try {
      // TODO: Upload proofFile to Supabase Storage
      // TODO: Create payment_proof record + update payment.status to pending_verification
      // Listing status stays pending_payment until admin confirms
      await new Promise((res) => setTimeout(res, 1200));
      trackBankTransferSubmit({
        listing_id: listingId,
        package_name: SELECTED_PACKAGE.name,
        value: SELECTED_PACKAGE.price,
      });
      setUploaded(true);
    } finally {
      setIsProcessing(false);
    }
  }

  if (uploaded) {
    return (
      <Card padding="lg" shadow>
        <div className="text-center py-6">
          <div className="w-14 h-14 rounded-full bg-success-light flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Proof submitted!</h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs mx-auto">
            We&apos;ve received your payment proof. Our team will verify it within{" "}
            <strong>1–2 business days</strong> and notify you by email.
          </p>
          <div className="mt-6 bg-slate-50 rounded-xl p-4 text-sm text-left space-y-2">
            <p className="text-slate-500">
              <strong className="text-slate-700">Reference:</strong> RMB-{listingId?.slice(0, 6).toUpperCase() ?? "DEMO01"}
            </p>
            <p className="text-slate-500">
              <strong className="text-slate-700">Status:</strong> Pending verification
            </p>
          </div>
          <a
            href="/dashboard"
            className="mt-6 inline-flex items-center justify-center h-10 px-5 bg-brand text-white rounded-xl text-sm font-semibold hover:bg-brand-dark transition-colors"
          >
            Go to Dashboard
          </a>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Order summary */}
      <Card padding="md" border>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Selected Plan</p>
            <p className="font-bold text-slate-900">{SELECTED_PACKAGE.name}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-400">Monthly</p>
            <p className="text-2xl font-bold text-slate-900">RM{SELECTED_PACKAGE.price}</p>
          </div>
        </div>
      </Card>

      {/* Bank transfer — the only payment method */}
      <Card padding="lg" shadow>
        <h3 className="font-semibold text-slate-900 mb-4">Bank Transfer Details</h3>
        <p className="text-sm text-slate-500 mb-4">
          Transfer the amount below to our bank account, then upload a screenshot of your transfer as proof.
        </p>
        <div className="bg-slate-50 rounded-xl p-4 text-sm space-y-3 mb-5">
          {[
            ["Bank", BANK_TRANSFER_DETAILS.bank_name],
            ["Account Name", BANK_TRANSFER_DETAILS.account_name],
            ["Account Number", BANK_TRANSFER_DETAILS.account_number],
            [
              "Reference",
              `${BANK_TRANSFER_DETAILS.reference_prefix}-${listingId?.slice(0, 6).toUpperCase() ?? "DEMO01"}`,
            ],
            ["Amount", `RM ${SELECTED_PACKAGE.price}.00`],
          ].map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4">
              <span className="text-slate-400 shrink-0">{label}</span>
              <span className="font-semibold text-slate-800 text-right">{value}</span>
            </div>
          ))}
        </div>

        <div className="bg-warning-light border border-orange-200 rounded-xl px-4 py-3 text-xs text-orange-700 mb-5">
          <strong>Important:</strong> Use the exact reference number above when making the transfer so we can match your payment.
        </div>

        {/* Proof upload */}
        <div className="flex flex-col gap-3">
          <p className="text-sm font-semibold text-slate-700">
            Upload Transfer Proof
          </p>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl p-6 cursor-pointer hover:border-brand hover:bg-brand-light/50 transition-colors">
            <svg className="w-8 h-8 text-slate-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {proofFile ? (
              <p className="text-sm text-brand font-medium">{proofFile.name}</p>
            ) : (
              <>
                <p className="text-sm text-slate-500 font-medium">Click to upload screenshot</p>
                <p className="text-xs text-slate-400 mt-1">PNG, JPG or PDF · Max 5MB</p>
              </>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*,application/pdf"
              onChange={(e) => setProofFile(e.target.files?.[0] ?? null)}
            />
          </label>
          <Button
            fullWidth
            size="lg"
            isLoading={isProcessing}
            disabled={!proofFile}
            onClick={handleBankTransferSubmit}
          >
            Submit Payment Proof
          </Button>
        </div>
      </Card>
    </div>
  );
}
