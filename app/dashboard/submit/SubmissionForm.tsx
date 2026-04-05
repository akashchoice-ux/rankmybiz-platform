"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/app/components/ui/Input";
import Textarea from "@/app/components/ui/Textarea";
import Select from "@/app/components/ui/Select";
import Button from "@/app/components/ui/Button";
import Card from "@/app/components/ui/Card";
import {
  FNB_CATEGORIES_STATIC,
  RENOVATION_CATEGORIES_STATIC,
  MY_STATES,
  PACKAGES,
  PLATFORM_INDUSTRIES,
  SUBMISSION_STEPS,
} from "@/lib/constants";
import type { SubmissionFormData } from "@/types";

const EMPTY_FORM: SubmissionFormData = {
  // Step 0
  industry_id: "",
  category_id: "",
  subcategory_id: "",
  // Step 1
  name: "",
  description: "",
  phone: "",
  email: "",
  whatsapp: "",
  logo_url: "",
  custom_attributes: {},
  // Step 2
  address: "",
  city: "",
  state: "",
  postcode: "",
  // Step 3
  website: "",
  google_business_url: "",
  service_areas: [],
  // Step 4
  package_id: "",
};

// Static F&B attribute definitions — will be fetched from Supabase once wired.
// These match the attribute_definitions seed rows in supabase/schema.sql.
const FNB_STATIC_ATTRIBUTES = [
  { key: "halal_certified", label: "Halal Certified", type: "boolean" },
  { key: "delivery_available", label: "Delivery Available", type: "boolean" },
  {
    key: "price_range",
    label: "Price Range",
    type: "select",
    options: [
      { value: "budget", label: "Budget (< RM20 per pax)" },
      { value: "mid_range", label: "Mid-range (RM20–60)" },
      { value: "premium", label: "Premium (RM60+)" },
    ],
  },
];

const CATERING_ATTRIBUTES = [
  { key: "min_pax", label: "Minimum Pax", type: "number", placeholder: "e.g. 30" },
  { key: "max_pax", label: "Maximum Pax", type: "number", placeholder: "e.g. 500" },
];

export default function SubmissionForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<SubmissionFormData>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = SUBMISSION_STEPS.length; // 6 steps (0–5)
  const isCatering = form.category_id === "catering";

  // Categories for the selected industry
  const categoriesForIndustry =
    form.industry_id === "renovation"
      ? RENOVATION_CATEGORIES_STATIC
      : FNB_CATEGORIES_STATIC;

  function update(
    field: keyof SubmissionFormData,
    value: string | string[] | Record<string, unknown>
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateAttr(key: string, value: string | number | boolean) {
    setForm((prev) => ({
      ...prev,
      custom_attributes: { ...prev.custom_attributes, [key]: value },
    }));
  }

  function toggleServiceArea(state: string) {
    setForm((prev) => ({
      ...prev,
      service_areas: prev.service_areas.includes(state)
        ? prev.service_areas.filter((s) => s !== state)
        : [...prev.service_areas, state],
    }));
  }

  function canProceed(): boolean {
    if (step === 0) return !!(form.industry_id && form.category_id);
    if (step === 1)
      return !!(form.name && form.description && form.phone && form.email);
    if (step === 2)
      return !!(form.address && form.city && form.state && form.postcode);
    if (step === 3) return true; // online presence optional
    if (step === 4) return !!form.package_id;
    return true; // step 5 review — always can submit
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      // TODO: POST to Supabase — create business_profile + listing records
      await new Promise((res) => setTimeout(res, 800));
      router.push("/dashboard/submit/payment?listing_id=demo");
    } catch {
      // handle error
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedPackage = PACKAGES.find((p) => p.id === form.package_id);
  const selectedCategory = [...FNB_CATEGORIES_STATIC, ...RENOVATION_CATEGORIES_STATIC].find(
    (c) => c.slug === form.category_id
  );

  return (
    <div>
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
          {SUBMISSION_STEPS.map((s, i) => (
            <div key={s.step} className="flex items-center gap-1.5 shrink-0">
              <div
                className={[
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors",
                  step === i
                    ? "bg-brand text-white"
                    : step > i
                    ? "bg-success text-white"
                    : "bg-slate-100 text-slate-400",
                ].join(" ")}
              >
                {step > i ? (
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={`h-px w-4 sm:w-8 shrink-0 ${
                    step > i ? "bg-success" : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs text-slate-400 font-medium">
            Step {step + 1} of {totalSteps}
          </p>
          <h2 className="text-base font-semibold text-slate-900">
            {SUBMISSION_STEPS[step].title}
          </h2>
          <p className="text-sm text-slate-500">
            {SUBMISSION_STEPS[step].description}
          </p>
        </div>
      </div>

      {/* Step content */}
      <Card padding="lg" shadow>
        {/* ── Step 0: Industry + Category ── */}
        {step === 0 && (
          <div className="flex flex-col gap-6">
            {/* Industry selection */}
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">
                Select your industry
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PLATFORM_INDUSTRIES.map((ind) => {
                  const isActive = ind.phase === "active";
                  const isSelected = form.industry_id === ind.slug;
                  return (
                    <button
                      key={ind.slug}
                      type="button"
                      disabled={!isActive}
                      onClick={() => {
                        if (!isActive) return;
                        update("industry_id", ind.slug);
                        update("category_id", "");
                        update("subcategory_id", "");
                      }}
                      className={[
                        "relative rounded-xl border-2 p-4 text-left transition-all",
                        isSelected
                          ? "border-brand bg-brand-light"
                          : isActive
                          ? "border-slate-200 bg-white hover:border-slate-300"
                          : "border-slate-100 bg-slate-50 opacity-50 cursor-not-allowed",
                      ].join(" ")}
                    >
                      {!isActive && (
                        <span className="absolute top-2 right-2 bg-slate-200 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                          {ind.phase === "coming_soon" ? "Soon" : "Roadmap"}
                        </span>
                      )}
                      <div className="text-2xl mb-1.5">{ind.icon}</div>
                      <p className="font-semibold text-slate-900 text-sm leading-tight">
                        {ind.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 leading-tight">
                        {ind.tagline}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Category — shown only after industry selected */}
            {form.industry_id && (
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  What best describes your business?
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {categoriesForIndustry.map((cat) => {
                    const isSelected = form.category_id === cat.slug;
                    return (
                      <button
                        key={cat.slug}
                        type="button"
                        onClick={() => {
                          update("category_id", cat.slug);
                          update("subcategory_id", "");
                        }}
                        className={[
                          "flex items-center gap-2 px-3 py-2.5 rounded-lg border transition-colors text-left text-sm font-medium",
                          isSelected
                            ? "border-brand bg-brand-light text-brand"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300",
                        ].join(" ")}
                      >
                        <span className="text-base">{cat.icon}</span>
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Step 1: Business Details ── */}
        {step === 1 && (
          <div className="flex flex-col gap-5">
            <Input
              label="Business Name"
              placeholder="e.g. Ahmad's Kitchen"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
            <Textarea
              label="Business Description"
              placeholder="Tell customers what makes your business special — your specialties, story, or what you offer."
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={4}
              required
              hint="Aim for 50–200 words. This appears on your public listing."
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+60 12-345 6789"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                required
              />
              <Input
                label="WhatsApp Number"
                type="tel"
                placeholder="+60 12-345 6789"
                value={form.whatsapp}
                onChange={(e) => update("whatsapp", e.target.value)}
                hint="Optional but recommended"
              />
            </div>
            <Input
              label="Business Email"
              type="email"
              placeholder="business@example.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              required
            />

            {/* Dynamic F&B attributes */}
            {form.industry_id === "fnb" && (
              <div className="flex flex-col gap-4 pt-2 border-t border-slate-100">
                <p className="text-sm font-semibold text-slate-700">
                  {selectedCategory?.label ?? "F&B"} Details
                </p>

                {/* Boolean toggles */}
                {FNB_STATIC_ATTRIBUTES.filter((a) => a.type === "boolean").map(
                  (attr) => {
                    const val = !!form.custom_attributes[attr.key];
                    return (
                      <div
                        key={attr.key}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm text-slate-700">
                          {attr.label}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateAttr(attr.key, !val)}
                          className={[
                            "w-11 h-6 rounded-full transition-colors relative",
                            val ? "bg-brand" : "bg-slate-200",
                          ].join(" ")}
                        >
                          <span
                            className={[
                              "absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform",
                              val ? "translate-x-[22px]" : "translate-x-0.5",
                            ].join(" ")}
                          />
                        </button>
                      </div>
                    );
                  }
                )}

                {/* Price range select */}
                {FNB_STATIC_ATTRIBUTES.filter((a) => a.type === "select").map(
                  (attr) => (
                    <Select
                      key={attr.key}
                      label={attr.label}
                      options={attr.options ?? []}
                      placeholder="Select one"
                      value={
                        (form.custom_attributes[attr.key] as string) ?? ""
                      }
                      onChange={(e) => updateAttr(attr.key, e.target.value)}
                    />
                  )
                )}

                {/* Catering-specific fields */}
                {isCatering && (
                  <div className="grid grid-cols-2 gap-4">
                    {CATERING_ATTRIBUTES.map((attr) => (
                      <Input
                        key={attr.key}
                        label={attr.label}
                        type="number"
                        placeholder={attr.placeholder}
                        value={
                          String(form.custom_attributes[attr.key] ?? "") ?? ""
                        }
                        onChange={(e) =>
                          updateAttr(attr.key, Number(e.target.value))
                        }
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Step 2: Location ── */}
        {step === 2 && (
          <div className="flex flex-col gap-5">
            <Textarea
              label="Street Address"
              placeholder="No. 12, Jalan Ampang, Chow Kit"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              rows={2}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                placeholder="Kuala Lumpur"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                required
              />
              <Input
                label="Postcode"
                placeholder="50400"
                value={form.postcode}
                onChange={(e) => update("postcode", e.target.value)}
                required
              />
            </div>
            <Select
              label="State"
              options={MY_STATES}
              placeholder="Select state"
              value={form.state}
              onChange={(e) => update("state", e.target.value)}
              required
            />
          </div>
        )}

        {/* ── Step 3: Online Presence ── */}
        {step === 3 && (
          <div className="flex flex-col gap-5">
            <Input
              label="Google Business Profile URL"
              type="url"
              placeholder="https://maps.google.com/..."
              value={form.google_business_url}
              onChange={(e) => update("google_business_url", e.target.value)}
              hint="Paste the link to your Google Maps listing if you have one."
            />
            <Input
              label="Website URL"
              type="url"
              placeholder="https://yourrestaurant.com"
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
              hint="Optional — leave blank if you don't have one."
            />
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-1">
                Service Areas
              </p>
              <p className="text-xs text-slate-500 mb-3">
                Select all states where you operate or deliver.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {MY_STATES.map(({ value: stateVal, label }) => {
                  const selected = form.service_areas.includes(stateVal);
                  return (
                    <button
                      key={stateVal}
                      type="button"
                      onClick={() => toggleServiceArea(stateVal)}
                      className={[
                        "px-3 py-2 rounded-lg text-sm font-medium border transition-colors text-left",
                        selected
                          ? "bg-brand-light border-brand text-brand"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300",
                      ].join(" ")}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Package Selection ── */}
        {step === 4 && (
          <div className="flex flex-col gap-4">
            {PACKAGES.map((pkg) => {
              const selected = form.package_id === pkg.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => update("package_id", pkg.id)}
                  className={[
                    "w-full text-left rounded-xl border-2 p-5 transition-all",
                    selected
                      ? "border-brand bg-brand-light"
                      : "border-slate-200 bg-white hover:border-slate-300",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-slate-900">
                          {pkg.name}
                        </span>
                        {pkg.is_popular && (
                          <span className="bg-brand text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">{pkg.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xl font-bold text-slate-900">
                        RM{pkg.price}
                      </span>
                      <span className="text-xs text-slate-400">/mo</span>
                    </div>
                  </div>
                  <ul className="mt-3 grid grid-cols-1 gap-1">
                    {pkg.features.slice(0, 3).map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-xs text-slate-500"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-success shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {f}
                      </li>
                    ))}
                    {pkg.features.length > 3 && (
                      <li className="text-xs text-brand font-medium mt-1">
                        +{pkg.features.length - 3} more features
                      </li>
                    )}
                  </ul>
                </button>
              );
            })}
          </div>
        )}

        {/* ── Step 5: Review & Submit ── */}
        {step === 5 && (
          <div className="flex flex-col gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">
                Business Details
              </h3>
              <div className="bg-slate-50 rounded-xl p-4 text-sm space-y-2">
                <Row label="Name" value={form.name} />
                <Row
                  label="Category"
                  value={selectedCategory?.label ?? form.category_id}
                />
                <Row label="Phone" value={form.phone} />
                <Row label="Email" value={form.email} />
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-3">Location</h3>
              <div className="bg-slate-50 rounded-xl p-4 text-sm space-y-2">
                <Row
                  label="Address"
                  value={`${form.address}, ${form.city}, ${form.state} ${form.postcode}`}
                />
              </div>
            </div>
            {selectedPackage && (
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">
                  Selected Plan
                </h3>
                <div className="bg-brand-light border border-indigo-200 rounded-xl p-4 text-sm flex items-center justify-between">
                  <span className="font-semibold text-brand">
                    {selectedPackage.name}
                  </span>
                  <span className="font-bold text-slate-900">
                    RM{selectedPackage.price}/month
                  </span>
                </div>
              </div>
            )}
            <p className="text-xs text-slate-400">
              By submitting, you confirm that all information is accurate and
              agree to our Terms of Service.
            </p>
          </div>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          Back
        </Button>
        {step < totalSteps - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed()}>
            Continue
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!canProceed()}
          >
            Submit &amp; Choose Payment
          </Button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-slate-400 shrink-0">{label}</span>
      <span className="text-slate-700 font-medium text-right">{value}</span>
    </div>
  );
}
