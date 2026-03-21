"use client";

import axios from "axios";
import { Suspense, useEffect, useState } from "react";
import { SquarePen } from "lucide-react";
import { Trash2 } from "lucide-react";
import Loading from "@/src/app/loading";
export default function FDPage() {
  const [fds, setFds] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setname] = useState("Loading...");
  const [addbuttonhide, setaddbuttonhide]=useState(false);
  const [createupdateformbutton, setcreateupdateformbutton] = useState(false);
  const [form, setForm] = useState({
    bankName: "",
    principalAmount: "",
    interestRate: "",
    tenure: "",
    compoundingFrequency: "",
    maturityDate: "",
    maturityAmount: "",
  });

  //fetch user name
  const fetchuserdata = async () => {
    try {
      const res = await axios.get("/api/getuserdata");
      setname(res.data.data.Name);
    } catch (error) {
      console.log(error);
    }
  };
  // Fetch all FDs
  const fetchFDs = async () => {
    const res = await axios.get("/api/FD");
    setFds(res.data.fddata || []);
  };

  useEffect(() => {
    fetchuserdata();
    fetchFDs();
  }, []);

  // Handle input change
  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  //delete
  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/FD/${id}`);
      fetchFDs();
    } catch (error: any) {
      alert(
        "Error deleting FD: " + (error.response?.data?.message || error.message),
      );
    }
  };
  // Create OR Update FD
  const handleSubmit = async () => {
    try {
      if (editingId) {
        // UPDATE
        await axios.put(`/api/FD/${editingId}`, form);
      } else {
        // CREATE
        await axios.post("/api/FD", form);
      }

      // Reset form
      setForm({
        bankName: "",
        principalAmount: "",
        interestRate: "",
        tenure: "",
        compoundingFrequency: "",
        maturityDate: "",
        maturityAmount: "",
      });
      setEditingId(null);
      setcreateupdateformbutton(false);

      fetchFDs();
    } catch (error: any) {
      alert(
        "Error saving FD: " + (error.response?.data?.message || error.message),
      );
    }
  };

  // Load data into form for editing
  const handleEdit = (fd: any) => {
    setEditingId(fd._id);
    setcreateupdateformbutton(true);

    setForm({
      bankName: fd.bankName,
      principalAmount: fd.principalAmount,
      interestRate: fd.interestRate,
      tenure: fd.tenure,
      compoundingFrequency: fd.compoundingFrequency,
      maturityDate: fd.maturityDate,
      maturityAmount: fd.maturityAmount,
    });
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#0d0d0d] text-white font-sans">
      {!addbuttonhide && (
        <button className="fixed z-99 bottom-0 right-0 p-4 bg-red-600 text-white hover:bg-red-400 hover:ease-in-out hover:duration-75 m-3 rounded-2xl " onClick={() => {
        setaddbuttonhide(true);
        setcreateupdateformbutton(true);
        setEditingId(null);
        setForm({ bankName: "", principalAmount: "", interestRate: "", tenure: "", compoundingFrequency: "", maturityDate: "", maturityAmount: "" });
      }}>
        +
      </button>
      )}
      {addbuttonhide && (<button className="fixed z-99 bottom-0 right-0 p-4 bg-red-600 text-white hover:bg-red-400 hover:ease-in-out hover:duration-75 m-3 rounded-2xl " onClick={() => {
        setaddbuttonhide(false);
        setcreateupdateformbutton(false);
        setEditingId(null);
        setForm({ bankName: "", principalAmount: "", interestRate: "", tenure: "", compoundingFrequency: "", maturityDate: "", maturityAmount: "" });
      }}>Back</button>)}
      <div className="flex justify-between px-6 py-4 sticky top-0 bg-[#0d0d0d]">
        <h1 className="text-2xl font-bold tracking-tight">Fixed Deposit</h1>
        <p className="font-sans font-bold tracking-tight text-red-600">
          {name}
        </p>
      </div>
      <div className="px-6 py-5">
        {createupdateformbutton ? (<div className="max-w-md mx-auto bg-black text-white p-6 rounded-2xl shadow-lg border border-gray-800 flex flex-col gap-4">
  
  <h2 className="text-2xl font-semibold text-center">
    {editingId ? "Update FD" : "Create FD"}
  </h2>

  <input
    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
    name="bankName"
    placeholder="Bank Name"
    value={form.bankName}
    onChange={handleChange}
  />

  <input
    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
    name="principalAmount"
    placeholder="Principal Amount"
    value={form.principalAmount}
    onChange={handleChange}
  />

  <input
    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
    name="interestRate"
    placeholder="Interest Rate"
    value={form.interestRate}
    onChange={handleChange}
  />

  <input
    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
    name="tenure"
    placeholder="Tenure"
    value={form.tenure}
    onChange={handleChange}
  />

  <input
    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
    name="compoundingFrequency"
    placeholder="Compounding Frequency"
    value={form.compoundingFrequency}
    onChange={handleChange}
  />

  <input
    type="date"
    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
    name="maturityDate"
    value={form.maturityDate}
    onChange={handleChange}
  />

  <input
    className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
    name="maturityAmount"
    placeholder="Maturity Amount"
    value={form.maturityAmount}
    onChange={handleChange}
  />

  <button
    onClick={handleSubmit}
    className="bg-red-600 hover:bg-red-700 transition-all duration-200 py-2 rounded-lg font-semibold shadow-md hover:shadow-red-500/30"
  >
    {editingId ? "Update FD" : "Create FD"}
  </button>

</div>) : (
          <>

            {fds.map((fd) => (
              <div key={fd._id} className="border-r border-b border-red-600 rounded-xl px-5 py-6 mt-5 relative">
                <Suspense fallback={<Loading />}>
                <p className="text-xl font-bold text-white ">{fd.bankName}-<span className="text-sm text-red-400"> {fd.interestRate}%</span></p>
                <p>
                   Amount:- ₹{fd.amount || fd.principalAmount} - 
                </p>
                <p className="text-white">Maturity Amount :- ₹{fd.maturityAmount}</p>
                <p className="text-white">Tenure :- {fd.tenure} years</p>
                <p className="text-white">Maturity Date :- {fd.maturityDate}</p> 

                <button className="absolute right-0 top-0 m-2" onClick={() => handleEdit(fd)}> <SquarePen /></button>
                <button className="absolute right-0 top-10 m-2" onClick={() => handleDelete(fd._id)}><Trash2 /></button>
                </Suspense>
              </div> 
            ))}
            {fds.length === 0 && <p className="text-white flex justify-center items-center"><span className="text-red-600">No</span> {name}'s <span className="text-red-600 gap-1"> FD</span> Data Found.</p>}
          </>
        )}
        

        
      </div>
    </div>
  );
}
