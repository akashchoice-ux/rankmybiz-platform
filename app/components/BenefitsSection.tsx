export default function BenefitsSection() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            Why businesses switch to RankMyBiz
          </h2>
          <p className="mt-3 text-slate-500 max-w-lg mx-auto">
            Your competitors are already ranking. Here&apos;s how we help you catch up
            and overtake them.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          {[
            {
              title: "Show up when customers search on Google",
              desc: "Your listing appears on Google Search and Maps with proper business structured data, keywords, and location targeting. Customers in your area find you — not the competitor down the road.",
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              ),
            },
            {
              title: "Get recommended by AI assistants",
              desc: "ChatGPT, Perplexity, and Gemini pull from structured, verified business data. Your RankMyBiz listing is built to be cited when people ask AI for business recommendations.",
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              ),
            },
            {
              title: "Rank in every area you serve",
              desc: "Serve customers in Petaling Jaya, Shah Alam, and KL? We create dedicated SEO pages for each location — so you rank where your customers are searching, not just where your office is.",
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              ),
            },
            {
              title: "Zero technical work on your end",
              desc: "You fill in a form. We handle all the SEO, page generation, structured data, and search optimization. You don't need to understand marketing — just run your business.",
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
          ].map((b) => (
            <div
              key={b.title}
              className="bg-white border border-slate-100 rounded-2xl p-6 flex gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-light text-brand flex items-center justify-center shrink-0 mt-0.5">
                {b.icon}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900 mb-1.5">
                  {b.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {b.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
