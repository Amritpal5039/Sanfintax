// import axios from "axios"
// import { useEffect, useState } from "react"

// export default function FD() {
//     const [FD, setFD] = useState([])
//     const handleaddfd =async()=>{
//         try{
//             const response = await axios.post("/api/FD");
//         }
//     }
//     return(
//         <div>
//             <button onClick={()=>handleaddfd}>Enter the FD details</button>
//             <button >View the FD details</button>
//         </div>
//     )
// }

"use client";
// src/app/dashboard/fd/page.tsx
// ─────────────────────────────────────────────────────────────────────────────
// FD Management Page
// - Fetches all FDs on load via GET /api/fd
// - Add new FD via POST /api/fd
// - Edit existing FD via PUT /api/fd/:id
// - Delete FD via DELETE /api/fd/:id
// - Summary cards: Total Invested, Total Maturity Value, Total Earnings
// - Cookie is sent automatically (same-origin Next.js API routes, no baseURL needed)
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import axios from "axios";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FD {
  _id: string;
  bankName: string;
  principalAmount: number;
  interestRate: number;
  tenure: number;                // months
  compoundingFrequency: number;  // per year
  maturityDate: string;          // "YYYY-MM-DD"
  maturityAmount: number;        // auto-calculated by backend
}

interface FDFormData {
  bankName: string;
  principalAmount: number | "";
  interestRate: number | "";
  tenure: number | "";
  compoundingFrequency: number;
  maturityDate: string;
}

const EMPTY_FORM: FDFormData = {
  bankName: "",
  principalAmount: "",
  interestRate: "",
  tenure: "",
  compoundingFrequency: 4,   // quarterly default
  maturityDate: "",
};

// Compounding options shown in the form dropdown
const COMPOUNDING_OPTIONS = [
  { label: "Yearly (1×)", value: 1 },
  { label: "Half-Yearly (2×)", value: 2 },
  { label: "Quarterly (4×)", value: 4 },
  { label: "Monthly (12×)", value: 12 },
];

// ── Axios instance ─────────────────────────────────────────────────────────────
// Since the API is in the same Next.js project, no baseURL needed.
// Cookies are sent automatically for same-origin requests.
const api = axios.create({ withCredentials: true });

// ── Currency formatter ─────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

// ─────────────────────────────────────────────────────────────────────────────
// Page Component
// ─────────────────────────────────────────────────────────────────────────────
export default function FDPage() {
  const [fds, setFds] = useState<FD[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  // Modal / form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<FD | null>(null);
  const [form, setForm] = useState<FDFormData>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete confirmation state
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ── Fetch all FDs ────────────────────────────────────────────────────────────
  const fetchFDs = async () => {
    try {
      setLoading(true);
      setPageError("");
      // GET /api/fd  — cookie sent automatically (same origin)
      const res = await api.get<FD[]>("/api/FD");
      setFds(res.data);
    } catch (err: any) {
      setPageError(
        err?.response?.data?.message || "Failed to load FDs. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFDs();
  }, []);

  // ── Open modal helpers ────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setModalOpen(true);
  };

  const openEdit = (fd: FD) => {
    setEditTarget(fd);
    setForm({
      bankName: fd.bankName,
      principalAmount: fd.principalAmount,
      interestRate: fd.interestRate,
      tenure: fd.tenure,
      compoundingFrequency: fd.compoundingFrequency,
      maturityDate: fd.maturityDate.slice(0, 10),  // "YYYY-MM-DD" for <input type="date">
    });
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormError("");
  };

  // ── Form input handler ────────────────────────────────────────────────────────
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const textFields = ["bankName", "maturityDate"];
    setForm((prev) => ({
      ...prev,
      [name]: textFields.includes(name) ? value : value === "" ? "" : Number(value),
    }));
  };

  // ── Submit (Add or Update) ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    // Client-side validation
    if (!form.bankName.trim())       return setFormError("Bank name is required.");
    if (!form.principalAmount || Number(form.principalAmount) <= 0)
                                      return setFormError("Principal must be greater than 0.");
    if (!form.interestRate || Number(form.interestRate) <= 0)
                                      return setFormError("Interest rate must be greater than 0.");
    if (!form.tenure || Number(form.tenure) <= 0)
                                      return setFormError("Tenure must be greater than 0.");
    if (!form.maturityDate)           return setFormError("Maturity date is required.");

    try {
      setSubmitting(true);
      setFormError("");

      if (editTarget) {
        // PUT /api/fd/:id  — update existing
        await api.put(`/api/fd/${editTarget._id}`, form);
      } else {
        // POST /api/fd  — create new; backend reads email from JWT cookie
        await api.post("/api/fd", form);
      }

      await fetchFDs();   // refresh the list
      closeModal();
    } catch (err: any) {
      setFormError(err?.response?.data?.message || "Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Delete ────────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      // DELETE /api/fd/:id
      await api.delete(`/api/fd/${deleteId}`);
      setFds((prev) => prev.filter((fd) => fd._id !== deleteId));
    } catch (err: any) {
      setPageError(err?.response?.data?.message || "Delete failed. Try again.");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  // ── Summary calculations ──────────────────────────────────────────────────────
  const totalInvested = fds.reduce((s, fd) => s + fd.principalAmount, 0);
  const totalMaturity = fds.reduce((s, fd) => s + fd.maturityAmount, 0);
  const totalEarnings = totalMaturity - totalInvested;

  // ── JSX ───────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0f1117] text-white px-4 py-8 md:px-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fixed Deposits</h1>
          <p className="text-sm text-gray-400 mt-1">
            Track, add, and manage all your FDs
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 transition-colors text-black font-semibold px-4 py-2 rounded-xl text-sm shadow-lg shadow-emerald-900/40"
        >
          <span className="text-lg leading-none">＋</span> Add FD
        </button>
      </div>

      {/* Summary Cards — only shown when FDs exist */}
      {!loading && fds.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <SummaryCard label="Total Invested"      value={fmt(totalInvested)} color="text-blue-400"    />
          <SummaryCard label="Total Maturity Value" value={fmt(totalMaturity)} color="text-emerald-400" />
          <SummaryCard label="Total Earnings"       value={fmt(totalEarnings)} color="text-yellow-400"  />
        </div>
      )}

      {/* Page-level error */}
      {pageError && (
        <div className="mb-6 rounded-xl bg-red-900/40 border border-red-700 text-red-300 px-4 py-3 text-sm">
          {pageError}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && fds.length === 0 && !pageError && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">🏦</div>
          <p className="text-gray-300 text-lg font-medium">No Fixed Deposits yet</p>
          <p className="text-gray-500 text-sm mt-1">
            Click &quot;Add FD&quot; to start tracking your deposits.
          </p>
        </div>
      )}

      {/* FD Table */}
      {!loading && fds.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-white/10 text-left">
                {[
                  "Bank",
                  "Principal",
                  "Rate",
                  "Tenure",
                  "Compounding",
                  "Maturity Date",
                  "Maturity Amount",
                  "",
                ].map((h) => (
                  <th key={h} className="px-5 py-4 font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {fds.map((fd, idx) => (
                <tr
                  key={fd._id}
                  className={`hover:bg-white/5 transition-colors ${
                    idx < fds.length - 1 ? "border-b border-white/5" : ""
                  }`}
                >
                  <td className="px-5 py-4 font-semibold text-white">{fd.bankName}</td>
                  <td className="px-5 py-4 text-blue-300">{fmt(fd.principalAmount)}</td>
                  <td className="px-5 py-4 text-gray-300">{fd.interestRate}%</td>
                  <td className="px-5 py-4 text-gray-300">{fd.tenure} mo</td>
                  <td className="px-5 py-4 text-gray-300">
                    {COMPOUNDING_OPTIONS.find(
                      (o) => o.value === fd.compoundingFrequency
                    )?.label ?? `${fd.compoundingFrequency}×`}
                  </td>
                  <td className="px-5 py-4 text-gray-300">
                    {new Date(fd.maturityDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-5 py-4 font-bold text-emerald-400">
                    {fmt(fd.maturityAmount)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3 justify-end">
                      <button
                        onClick={() => openEdit(fd)}
                        className="text-xs text-blue-400 hover:text-blue-300 transition-colors font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteId(fd._id)}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      {modalOpen && (
        <Modal title={editTarget ? "Edit FD" : "Add New FD"} onClose={closeModal}>
          <div className="space-y-4">

            {/* Bank Name */}
            <Field label="Bank Name">
              <input
                name="bankName"
                value={form.bankName}
                onChange={handleChange}
                placeholder="e.g. SBI, HDFC, ICICI"
                className={inputCls}
              />
            </Field>

            {/* Principal + Interest Rate */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Principal Amount (₹)">
                <input
                  type="number"
                  name="principalAmount"
                  value={form.principalAmount}
                  onChange={handleChange}
                  placeholder="100000"
                  min={1}
                  className={inputCls}
                />
              </Field>
              <Field label="Interest Rate (% per annum)">
                <input
                  type="number"
                  step="0.01"
                  name="interestRate"
                  value={form.interestRate}
                  onChange={handleChange}
                  placeholder="7.5"
                  min={0.01}
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Tenure + Compounding */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Tenure (months)">
                <input
                  type="number"
                  name="tenure"
                  value={form.tenure}
                  onChange={handleChange}
                  placeholder="12"
                  min={1}
                  className={inputCls}
                />
              </Field>
              <Field label="Compounding Frequency">
                <select
                  name="compoundingFrequency"
                  value={form.compoundingFrequency}
                  onChange={handleChange}
                  className={inputCls}
                >
                  {COMPOUNDING_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* Maturity Date */}
            <Field label="Maturity Date">
              <input
                type="date"
                name="maturityDate"
                value={form.maturityDate}
                onChange={handleChange}
                className={inputCls}
              />
            </Field>

            {/* Form error */}
            {formError && (
              <p className="text-red-400 text-xs">{formError}</p>
            )}

            {/* Action buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={closeModal}
                className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-colors text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold text-sm transition-colors"
              >
                {submitting
                  ? "Saving…"
                  : editTarget
                  ? "Update FD"
                  : "Add FD"}
              </button>
            </div>

          </div>
        </Modal>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteId && (
        <Modal title="Delete this FD?" onClose={() => setDeleteId(null)}>
          <p className="text-gray-400 text-sm mb-6">
            This will permanently remove the FD record. This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteId(null)}
              className="flex-1 py-2.5 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 disabled:opacity-50 text-white font-semibold text-sm transition-colors"
            >
              {deleting ? "Deleting…" : "Yes, Delete"}
            </button>
          </div>
        </Modal>
      )}

    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Reusable sub-components
// ─────────────────────────────────────────────────────────────────────────────

function SummaryCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl bg-white/5 border border-white/10 px-5 py-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    // Clicking the backdrop closes the modal
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-[#1a1d27] border border-white/10 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white text-xl leading-none transition-colors"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

// Shared input/select class
const inputCls =
  "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500/60 transition-colors";