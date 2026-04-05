import Card from "@/app/components/ui/Card";

// Mock data — replace with Supabase query
const mockUsers = [
  { id: "1", name: "Siti Rahimah", email: "siti@email.com", role: "sme", listings: 1, joined: "5 Apr 2026" },
  { id: "2", name: "Ahmad Fauzi", email: "fauzi@email.com", role: "sme", listings: 2, joined: "2 Apr 2026" },
  { id: "3", name: "Tan Wei Jie", email: "weijie@email.com", role: "sme", listings: 1, joined: "1 Apr 2026" },
];

export default function AdminUsersPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Users</h1>
        <p className="text-slate-500 text-sm mt-1">All registered business owners on the platform.</p>
      </div>

      <Card padding="none" border shadow>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wider">Name</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wider">Email</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wider">Role</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wider">Listings</th>
                <th className="px-5 py-3 text-left font-semibold text-slate-500 text-xs uppercase tracking-wider">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50">
                  <td className="px-5 py-3.5 font-medium text-slate-900">{u.name}</td>
                  <td className="px-5 py-3.5 text-slate-500">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      u.role === "admin"
                        ? "bg-brand-light text-brand"
                        : "bg-slate-100 text-slate-600"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-500">{u.listings}</td>
                  <td className="px-5 py-3.5 text-slate-400">{u.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
