"use client";

import { useState } from "react";
import Button from "@/app/components/ui/Button";
import type { ListingStatus } from "@/types";
import { LISTING_STATUS_CONFIG } from "@/lib/constants";

interface AdminReviewPanelProps {
  listingId: string;
  currentStatus: ListingStatus;
  paymentMethod: string;
}

export default function AdminReviewPanel({
  listingId,
  currentStatus,
  paymentMethod,
}: AdminReviewPanelProps) {
  const [status, setStatus] = useState<ListingStatus>(currentStatus);
  const [note, setNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");

  async function performAction(action: "approve" | "reject" | "verify_payment" | "suspend" | "reinstate") {
    setIsLoading(true);
    setSuccess("");
    try {
      // TODO: Call Supabase update for listing status + create listing_review record
      await new Promise((res) => setTimeout(res, 800)); // placeholder

      const nextStatus: Record<string, ListingStatus> = {
        approve: "live",
        reject: "rejected",
        verify_payment: "pending_review",  // bank transfer confirmed → enters review queue
        suspend: "suspended",
        reinstate: "live",
      };
      setStatus(nextStatus[action]);
      setSuccess(
        action === "approve"
          ? "Listing approved and is now live!"
          : action === "reject"
          ? "Listing rejected. Owner will be notified."
          : action === "verify_payment"
          ? "Payment verified. Listing moved to review queue."
          : action === "suspend"
          ? "Listing suspended."
          : "Listing reinstated and is live again."
      );
      setShowRejectForm(false);
      setRejectionReason("");
    } finally {
      setIsLoading(false);
    }
  }

  async function addNote() {
    if (!note.trim()) return;
    setIsLoading(true);
    try {
      // TODO: Insert into admin_notes table
      await new Promise((res) => setTimeout(res, 500));
      setNote("");
      setSuccess("Note added.");
    } finally {
      setIsLoading(false);
    }
  }

  const statusConfig = LISTING_STATUS_CONFIG[status];

  return (
    <div className="flex flex-col gap-4">
      {/* Current status */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Current Status
        </p>
        <div className={`rounded-xl px-4 py-3 ${statusConfig.bgColor}`}>
          <p className={`font-semibold text-sm ${statusConfig.color}`}>{statusConfig.label}</p>
          <p className={`text-xs mt-0.5 ${statusConfig.color} opacity-75`}>{statusConfig.description}</p>
        </div>
      </div>

      {/* Success message */}
      {success && (
        <div className="bg-success-light border border-emerald-200 text-success text-sm rounded-xl px-4 py-3 font-medium">
          {success}
        </div>
      )}

      {/* Action buttons based on status */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Actions
        </p>
        <div className="flex flex-col gap-3">
          {/* Verify payment (bank transfer proof submitted, listing in pending_payment) */}
          {status === "pending_payment" && paymentMethod === "bank_transfer" && (
            <Button
              variant="primary"
              fullWidth
              isLoading={isLoading}
              onClick={() => performAction("verify_payment")}
            >
              ✓ Confirm Payment Received
            </Button>
          )}

          {/* Approve */}
          {status === "pending_review" && (
            <>
              <Button
                variant="primary"
                fullWidth
                isLoading={isLoading}
                onClick={() => performAction("approve")}
              >
                ✓ Approve &amp; Publish
              </Button>
              {!showRejectForm ? (
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowRejectForm(true)}
                >
                  Reject Listing
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <textarea
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-2 focus:outline-brand resize-none"
                    rows={3}
                    placeholder="Reason for rejection (required — sent to the business owner)"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="danger"
                      fullWidth
                      size="sm"
                      isLoading={isLoading}
                      disabled={!rejectionReason.trim()}
                      onClick={() => performAction("reject")}
                    >
                      Confirm Reject
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowRejectForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Suspend live listing */}
          {status === "live" && (
            <Button
              variant="outline"
              fullWidth
              isLoading={isLoading}
              onClick={() => performAction("suspend")}
            >
              Suspend Listing
            </Button>
          )}

          {/* Reinstate suspended */}
          {status === "suspended" && (
            <Button
              variant="primary"
              fullWidth
              isLoading={isLoading}
              onClick={() => performAction("reinstate")}
            >
              Reinstate Listing
            </Button>
          )}

          {/* States with no actions */}
          {(status === "draft" || status === "pending_payment") && (
            <p className="text-xs text-slate-400 text-center py-2">
              No actions required yet — waiting for payment.
            </p>
          )}

          {status === "rejected" && (
            <p className="text-xs text-slate-400 text-center py-2">
              Listing rejected. Owner can resubmit.
            </p>
          )}
        </div>
      </div>

      {/* Admin note */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Add Admin Note
        </p>
        <textarea
          className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-2 focus:outline-brand resize-none"
          rows={3}
          placeholder="Internal note (not visible to the business owner)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button
          variant="secondary"
          size="sm"
          className="mt-2"
          isLoading={isLoading}
          disabled={!note.trim()}
          onClick={addNote}
        >
          Save Note
        </Button>
      </div>
    </div>
  );
}
