import SubmissionForm from "./SubmissionForm";
import StartListingTracker from "./StartListingTracker";

export const metadata = {
  title: "Submit Listing — RankMyBiz",
};

export default function SubmitPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <StartListingTracker />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Submit your business listing
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Complete all steps to get your business found by more customers.
        </p>
      </div>
      <SubmissionForm />
    </div>
  );
}
