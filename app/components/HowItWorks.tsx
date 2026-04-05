import TrackedCTA from "./TrackedCTA";

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Up and running in minutes
          </h2>
          <p className="mt-3 text-slate-500 max-w-lg mx-auto">
            No technical skills needed. No agencies. No waiting months for results.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              step: "1",
              title: "List your business",
              desc: "Fill in your details, choose a plan, and submit. Takes under 5 minutes. We accept all business types.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              ),
            },
            {
              step: "2",
              title: "We optimize & rank you",
              desc: "Your listing gets SEO-optimized pages, structured data for Google and AI search, and multi-location coverage.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              ),
            },
            {
              step: "3",
              title: "Customers find you",
              desc: "Leads come in through calls, WhatsApp, and enquiry forms. You focus on serving customers, not marketing.",
              icon: (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              ),
            },
          ].map((item) => (
            <div
              key={item.step}
              className="text-center p-6 rounded-2xl bg-slate-50 border border-slate-100"
            >
              <div className="w-14 h-14 rounded-2xl bg-brand-light text-brand flex items-center justify-center mx-auto mb-5">
                {item.icon}
              </div>
              <div className="text-xs font-bold text-brand uppercase tracking-widest mb-2">
                Step {item.step}
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <TrackedCTA
            href="/dashboard/submit"
            label="How It Works — Get Listed Now"
            className="inline-flex items-center gap-2 bg-brand text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-brand-dark transition-colors"
          >
            Get Listed Now
          </TrackedCTA>
        </div>
      </div>
    </section>
  );
}
