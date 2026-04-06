"use client";

import { useState } from "react";
import { trackLeadSubmit } from "@/lib/analytics";

interface LeadFormClientProps {
  listingId: string;
  listingName: string;
}

export function LeadFormClient({ listingId, listingName }: LeadFormClientProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !phone) return;
    setIsLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listing_id: listingId, name, phone, message }),
      });
      trackLeadSubmit({ listing_id: listingId, listing_name: listingName });
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-success-light border border-emerald-200 rounded-2xl p-5 text-center">
        <p className="text-success font-semibold text-sm">Enquiry sent!</p>
        <p className="text-emerald-600 text-xs mt-1">
          {listingName} will contact you shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <h2 className="font-semibold text-slate-900 mb-4">Send an Enquiry</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-2 focus:outline-brand"
        />
        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-2 focus:outline-brand"
        />
        <textarea
          placeholder="What do you need? (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-2 focus:outline-brand resize-none"
        />
        <button
          type="submit"
          disabled={!name || !phone || isLoading}
          className="h-11 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Sending..." : "Send Enquiry"}
        </button>
        <p className="text-[11px] text-slate-400 text-center leading-tight">
          Your details are shared only with {listingName}.
        </p>
      </form>
    </div>
  );
}
