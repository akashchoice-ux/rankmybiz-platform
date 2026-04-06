import TrackedCTA from "./TrackedCTA";

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            How it works
          </h2>
          <p className="mt-4 text-lg text-slate-500 max-w-lg mx-auto">
            Three steps. No technical skills. Set up in under 5 minutes.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              step: "1",
              title: "Submit your business",
              desc: "Fill in your business details, SSM number, and choose a plan. Free listings are available for all verified businesses.",
              icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              ),
            },
            {
              step: "2",
              title: "We review & publish",
              desc: "Our team verifies your SSM number, reviews your listing, and publishes it with SEO-optimized structure and business data.",
              icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              ),
            },
            {
              step: "3",
              title: "Customers find you",
              desc: "Your listing starts working — customers reach you through WhatsApp, phone calls, and enquiry forms directly.",
              icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              ),
            },
          ].map((item) => (
            <div
              key={item.step}
              className="text-center p-7 rounded-2xl bg-slate-50 border border-slate-100"
            >
              <div className="w-16 h-16 rounded-2xl bg-brand-light text-brand flex items-center justify-center mx-auto mb-5">
                {item.icon}
              </div>
              <div className="text-sm font-bold text-brand uppercase tracking-widest mb-3">
                Step {item.step}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-3">
                {item.title}
              </h3>
              <p className="text-base text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <TrackedCTA
            href="/dashboard/submit"
            label="How It Works — Get Listed Free"
            className="inline-flex items-center gap-2 bg-brand text-white font-semibold px-8 py-4 rounded-xl text-base hover:bg-brand-dark transition-colors"
          >
            Get Listed Free
          </TrackedCTA>
        </div>
      </div>
    </section>
  );
}
