"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// ── Mock data ─────────────────────────────────────────────────────────────────
const areaData = [
  { month: "Jan", assets: 420000, liabilities: 180000 },
  { month: "Feb", assets: 450000, liabilities: 175000 },
  { month: "Mar", assets: 480000, liabilities: 190000 },
  { month: "Apr", assets: 510000, liabilities: 160000 },
  { month: "May", assets: 530000, liabilities: 170000 },
  { month: "Jun", assets: 560000, liabilities: 155000 },
];

const pieData = [
  { name: "Fixed Deposits", value: 320000, color: "#ef4444" },
  { name: "SIP / MF", value: 150000, color: "#dc2626" },
  { name: "Other Assets", value: 90000, color: "#7f1d1d" },
  { name: "Liabilities", value: 155000, color: "#1a1a1a" },
];

const radialData = [{ name: "Health Score", value: 74, fill: "#ef4444" }];

const recentActivity = [
  { label: "FD Added – SBI Bank", date: "Mar 15", amount: "+₹50,000", type: "asset" },
  { label: "EMI Paid – Home Loan", date: "Mar 14", amount: "-₹18,500", type: "liability" },
  { label: "SIP Invested", date: "Mar 10", amount: "+₹5,000", type: "asset" },
  { label: "Insurance Premium", date: "Mar 8", amount: "-₹3,200", type: "liability" },
  { label: "FD Matured – HDFC", date: "Mar 5", amount: "+₹80,000", type: "asset" },
];

const quickActions = [
  { label: "Add Fixed Deposit", icon: "🏦", href: "/dashboard/fd/add", accent: true },
  { label: "Add Asset", icon: "📈", href: "/dashboard/assets/add", accent: false },
  { label: "Add Liability", icon: "📉", href: "/dashboard/liabilities/add", accent: false },
  { label: "Add SIP", icon: "💹", href: "/dashboard/sip/add", accent: false },
  { label: "Set Goal", icon: "🎯", href: "/dashboard/goals/add", accent: false },
  { label: "SIP Calculator", icon: "🧮", href: "/dashboard/sip/calculator", accent: false },
];

// ── Sub-components ────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl p-6 border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl ${
        accent
          ? "bg-red-600 border-red-500 text-white"
          : "bg-[#111] border-[#222] text-white"
      }`}
    >
      {accent && (
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-red-500/30 blur-2xl" />
      )}
      <p className="text-xs uppercase tracking-widest opacity-60 mb-1">{label}</p>
      <p className="text-3xl font-bold font-mono">{value}</p>
      <p className="text-xs mt-2 opacity-50">{sub}</p>
    </div>
  );
}

function QuickActionBtn({
  label,
  icon,
  accent,
  onClick,
}: {
  label: string;
  icon: string;
  accent: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-95 ${
        accent
          ? "bg-red-600 border-red-500 text-white hover:bg-red-500"
          : "bg-[#111] border-[#222] text-zinc-300 hover:border-red-600 hover:text-white"
      }`}
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navItems = [
    { icon: "⊞", label: "Dashboard", active: true, href: "/dashboard" },
    { icon: "🏦", label: "Fixed Deposits", active: false, href: "/Pages/dashboard/fd" },
    { icon: "💹", label: "SIP / Mutual Funds", active: false, href: "/dashboard/sip" },
    { icon: "📈", label: "Assets", active: false, href: "/dashboard/assets" },
    { icon: "📉", label: "Liabilities", active: false, href: "/dashboard/liabilities" },
    { icon: "🎯", label: "Goals", active: false, href: "/dashboard/goals" },
    { icon: "📊", label: "Analytics", active: false, href: "/dashboard/analytics" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Sidebar ── */}
      <aside
        className={`${
          sidebarOpen ? "w-60" : "w-16"
        } flex-shrink-0 bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col py-6 transition-all duration-300 fixed h-full z-20`}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 mb-10 overflow-hidden`}>
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0 text-sm font-bold">
            S
          </div>
          {sidebarOpen && (
            <button className="text-white font-bold text-lg tracking-tight whitespace-nowrap" onClick={() => router.push("/")}>
              San<span className="text-red-500">fintax</span>
            </button>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-150 ${
                item.active
                  ? "bg-red-600/20 text-red-400 border border-red-600/30"
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
              }`}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="whitespace-nowrap">{item.label}</span>}
            </a>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-2 space-y-1 mt-4">
          <a
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all"
          >
            <span>⚙️</span>
            {sidebarOpen && <span>Settings</span>}
          </a>
          <a
            href="/api/auth/logout"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-zinc-500 hover:text-red-400 hover:bg-red-600/10 transition-all"
          >
            <span>🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </a>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className={`flex-1 ${sidebarOpen ? "ml-60" : "ml-16"} transition-all duration-300 min-h-screen`}>

        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition"
            >
              ☰
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-xs text-zinc-500">Your financial overview at a glance</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-400 text-sm">
              A
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">Amritpal Singh</p>
              <p className="text-xs text-zinc-500">MCA Final Year</p>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Assets" value="₹5.60L" sub="↑ 5.6% from last month" accent />
            <StatCard label="Total FD Value" value="₹3.20L" sub="4 active deposits" />
            <StatCard label="Total Liabilities" value="₹1.55L" sub="↓ 8.3% reduced" />
            <StatCard label="Net Worth" value="₹4.05L" sub="Assets − Liabilities" />
          </div>

          {/* ── Financial Health Score + Pie ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Health Score */}
            <div className="bg-[#111] border border-[#222] rounded-2xl p-6 flex flex-col items-center justify-center">
              <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Financial Health Score</p>
              <div className="relative">
                <RadialBarChart
                  width={160}
                  height={160}
                  innerRadius="70%"
                  outerRadius="100%"
                  data={radialData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar dataKey="value" cornerRadius={10} background={{ fill: "#1a1a1a" }} />
                </RadialBarChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-red-400">74</span>
                  <span className="text-xs text-zinc-500">/ 100</span>
                </div>
              </div>
              <div className="mt-3 text-center">
                <span className="text-sm font-medium text-yellow-400">Good</span>
                <p className="text-xs text-zinc-500 mt-1">Reduce liabilities to improve</p>
              </div>
            </div>

            {/* Portfolio Pie */}
            <div className="bg-[#111] border border-[#222] rounded-2xl p-6 lg:col-span-2">
              <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Portfolio Breakdown</p>
              <div className="flex items-center gap-6">
                <PieChart width={160} height={160}>
                  <Pie
                    data={pieData}
                    cx={75}
                    cy={75}
                    innerRadius={48}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} stroke="transparent" />
                    ))}
                  </Pie>
                </PieChart>
                <div className="flex flex-col gap-2 flex-1">
                  {pieData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-zinc-400">{item.name}</span>
                      </div>
                      <span className="font-mono text-white">₹{(item.value / 1000).toFixed(0)}K</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Area Chart ── */}
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500">Assets vs Liabilities</p>
                <p className="text-sm text-zinc-300 mt-0.5">Last 6 months trend</p>
              </div>
              <div className="flex gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-red-500 inline-block rounded" />Assets</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-zinc-600 inline-block rounded" />Liabilities</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={areaData}>
                <defs>
                  <linearGradient id="assetsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="liabGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3f3f46" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3f3f46" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis dataKey="month" stroke="#3f3f46" tick={{ fill: "#71717a", fontSize: 12 }} />
                <YAxis stroke="#3f3f46" tick={{ fill: "#71717a", fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}K`} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#111", border: "1px solid #222", borderRadius: 12, color: "#fff" }}
                  formatter={(value: number) => [`₹${(value / 1000).toFixed(1)}K`]}
                />
                <Area type="monotone" dataKey="assets" stroke="#ef4444" strokeWidth={2} fill="url(#assetsGrad)" />
                <Area type="monotone" dataKey="liabilities" stroke="#3f3f46" strokeWidth={2} fill="url(#liabGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* ── Quick Actions + Recent Activity ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

            {/* Quick Actions */}
            <div className="lg:col-span-2 bg-[#111] border border-[#222] rounded-2xl p-6">
              <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Quick Actions</p>
              <div className="space-y-2">
                {quickActions.map((action) => (
                  <QuickActionBtn
                    key={action.label}
                    label={action.label}
                    icon={action.icon}
                    accent={action.accent}
                    onClick={() => { window.location.href = action.href; }}
                  />
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="lg:col-span-3 bg-[#111] border border-[#222] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs uppercase tracking-widest text-zinc-500">Recent Activity</p>
                <a href="/dashboard/activity" className="text-xs text-red-500 hover:text-red-400 transition">View all →</a>
              </div>
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-[#1a1a1a] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.type === "asset" ? "bg-red-500" : "bg-zinc-600"}`} />
                      <div>
                        <p className="text-sm text-zinc-200">{item.label}</p>
                        <p className="text-xs text-zinc-600">{item.date}</p>
                      </div>
                    </div>
                    <span className={`text-sm font-mono font-medium ${item.type === "asset" ? "text-red-400" : "text-zinc-500"}`}>
                      {item.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── FD Summary Strip ── */}
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs uppercase tracking-widest text-zinc-500">Active Fixed Deposits</p>
              <a href="/dashboard/fd/add" className="text-xs bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded-lg transition">+ Add FD</a>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { bank: "SBI", amount: "₹1,00,000", rate: "7.1%", maturity: "Dec 2025" },
                { bank: "HDFC", amount: "₹80,000", rate: "7.4%", maturity: "Mar 2026" },
                { bank: "ICICI", amount: "₹70,000", rate: "7.0%", maturity: "Jun 2025" },
                { bank: "PNB", amount: "₹70,000", rate: "6.8%", maturity: "Sep 2025" },
              ].map((fd) => (
                <div key={fd.bank} className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl p-4 hover:border-red-600/30 transition-all duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-red-400">{fd.bank}</span>
                    <span className="text-xs text-zinc-600 bg-red-600/10 px-1.5 py-0.5 rounded">{fd.rate}</span>
                  </div>
                  <p className="text-lg font-mono font-bold">{fd.amount}</p>
                  <p className="text-xs text-zinc-600 mt-1">Matures: {fd.maturity}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

