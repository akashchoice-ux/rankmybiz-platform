import PaymentFlow from "./PaymentFlow";

export const metadata = {
  title: "Complete Payment",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function PaymentPage({ searchParams }: Props) {
  const params = await searchParams;
  const listingId = params?.listing_id as string | undefined;

  // TODO: Fetch listing + package details from Supabase using listingId

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Complete your payment
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Choose how you'd like to pay. Your listing goes under review once payment is confirmed.
        </p>
      </div>
      <PaymentFlow listingId={listingId} />
    </div>
  );
}
