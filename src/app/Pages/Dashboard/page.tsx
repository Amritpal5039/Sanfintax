


"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
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

export default function Dashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [name, setname] = useState("Loading...");
  const navItems = [
    { icon: "⊞", label: "Dashboard", active: true, href: "/dashboard" },
    {
      icon: "🏦",
      label: "Fixed Deposits",
      active: false,
      href: "/Pages/dashboard/fd",
    },
    {
      icon: "💹",
      label: "SIP / Mutual Funds",
      active: false,
      href: "/dashboard/sip",
    },
    { icon: "📈", label: "Assets", active: false, href: "/dashboard/assets" },
    {
      icon: "📉",
      label: "Liabilities",
      active: false,
      href: "/Pages/dashboard/liabilities",
    },
    { icon: "🎯", label: "Goals", active: false, href: "/dashboard/goals" },
    {
      icon: "📊",
      label: "Analytics",
      active: false,
      href: "/dashboard/analytics",
    },
  ];
  const [fdData, setFdData] = useState(0);
  const [fdData2, setfdData2]=useState([]);
  const fetchFdData = async () => {
    try {
      const res = await axios.get("/api/FD");
      setFdData(res.data.totalAmount);
      setfdData2(res.data.fddata);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchFdData();
  }, []);
  const pieData = [
    { name: "Fixed Deposits", value: `${fdData|| "loading.."}`, color: "#ef4444" },
    { name: "SIP / MF", value: 150000, color: "#dc2626" },
    { name: "Other Assets", value: 90000, color: "#7f1d1d" },
    { name: "Liabilities", value: 155000, color: "#1a1a1a" },
  ];
  const fetchuserdata = async () => {
    try {
      const res = await axios.get("/api/getuserdata");
      setname(res.data.data.Name);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchuserdata();
  }, []);
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
  return (
    <div className="flex w-full min-h-screen">
      <div>
        <aside
          className={`${
            sidebarOpen ? "w-60" : "w-16"
          } flex-shrink-0 bg-[#0d0d0d] border-r border-[#1a1a1a] flex flex-col py-6 transition-all duration-300 fixed h-full z-20`}
        >
          {/* Logo */}
          <div className={`flex items-center px-4 mb-10 overflow-hidden justify-center`}>
            {sidebarOpen && (
              <button className="text-white font-bold text-xl tracking-tight whitespace-nowrap " onClick={() => router.push("/")}>
                Sanfin<span className="text-red-500">tax</span>
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
                {sidebarOpen && (
                  <span className="whitespace-nowrap">{item.label}</span>
                )}
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
      </div>
      <div className="flex flex-col  flex-1 w-full">
        <main
          className={`flex-1 ${sidebarOpen ? "ml-60" : "ml-16"} transition-all duration-300 min-h-screen bg-[#0d0d0d]`}
        >
          <header className="sticky justify-between top-0 z-10 bg-[#0a0a0a]/80 backdrop-blur border-b border-[#1a1a1a] px-6 py-4 flex items-center ">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-white transition"
              >
                ☰
              </button>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-white">
                  Dashboard
                </h1>
                <p className="text-xs text-zinc-500">
                  Your financial overview at a glance
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="px-2 py-3 rounded-xl bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-400 text-sm">
                {name}
              </div>
            </div>
          </header>
          
            <div className="p-6 space-y-6">

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Assets" value="₹5.60L" sub="↑ 5.6% from last month" accent />
            <StatCard label="Total FD Value" value={String(fdData || "Loading...")} sub={fdData2.length ? `${fdData2.length} active deposits` : "No active deposits"} />
            <StatCard label="Total Liabilities" value="₹1.55L" sub="↓ 8.3% reduced" />
            <StatCard label="Net Worth" value="₹4.05L" sub="Assets − Liabilities" />
          </div>
            <div className="bg-[#111] border border-[#222] rounded-2xl m-4 p-6 lg:col-span-2 ">
              <p className="text-xs uppercase tracking-widest text-zinc-500 mb-4">
                Portfolio Breakdown
              </p>
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
                      <Cell
                        key={index}
                        fill={entry.color}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                </PieChart>
                <div className="flex flex-col gap-2 flex-1">
                  {pieData.map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-zinc-400">{item.name}</span>
                      </div>
                      <span className="font-mono text-white">
                        ₹{(Number(item.value) / 1000).toFixed(0)}K
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
