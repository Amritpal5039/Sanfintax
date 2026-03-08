"use client"
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function Register() {
  const [Name, setName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [login,setlogin]= useState(true);
  const [register,setregister]= useState(false);
  const router =useRouter();

  const handlesubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/register", { Name, email, password });
      alert(response.status === 201 ? "Registration successful" : "Registration failed");
      if(response.status === 201){router.push("/Pages/dashboard");}
    } catch (error: any) {
      alert(error.response?.data?.message || error.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };
  const handlelogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/login", { email, password });
      alert(response.status === 200 ? "Login successful" : "Login failed");
      if(response.status === 200){router.push("/Pages/dashboard");}
    } catch (error: any) {
      alert(error.response?.data?.message || error.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  const handlelogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/logout");
      alert(response.status === 200 ? "Logout successful" : "Logout failed");
      if(response.status === 200){router.push("/Pages/Login");}
    } catch (error: any) {
      alert(error.response?.data?.message || error.response?.data?.error || "Logout failed");
    } finally {
      setLoading(false);
    }
  };
  const fields = [
    { label: "Full Name",  type: "text",     placeholder: "John Doe",          value: Name,     onChange: setName },
    { label: "Email",      type: "email",    placeholder: "you@example.com",   value: email,    onChange: setemail },
    { label: "Password",   type: "password", placeholder: "Min. 8 characters", value: password, onChange: setpassword },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex">
        <button className="bg-stone-900 text-stone-50 text-xs py-3.5 hover:bg-stone-700 transition-colors px-4" onClick={()=>{router.push("/Pages/home")}}>H
            <br></br>
            o
            <br></br>
            m
            <br></br>
            e
        </button>

      {/* Left accent panel */}
      <div className="hidden lg:flex w-1/2 bg-stone-900 flex-col justify-between p-14">
        <span className="text-stone-400 text-xs tracking-[0.2em] uppercase">Sanfintax</span>
        <div>
          <h1 className="text-white text-5xl font-serif leading-tight mb-4">
            Your taxes,<br />
            <em className="text-stone-400">handled.</em>
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed max-w-xs">
            Trusted by thousands for simple, accurate financial management.
          </p>
        </div>
        <p className="text-stone-600 text-xs">© 2025 Sanfintax</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-sm">

          <p className="text-xs tracking-[0.2em] uppercase text-stone-400 mb-1">Get started</p>
          <div className="flex gap-2 my-4 w-full border-none rounded-md bg-stone-300 p-1 justify-center items-center">
            <button className="flex-1 bg-stone-900 text-stone-50 text-xs py-3.5 hover:bg-stone-700 transition-colors px-4 rounded-sm" onClick={()=>{setlogin(true); setregister(false)}}>Login</button>
            <button className="flex-1 bg-stone-900 text-stone-50 text-xs py-3.5 hover:bg-stone-700 transition-colors px-4 rounded-sm" onClick={()=>{setregister(true); setlogin(false)}}>Register</button>
          </div>
          {
          login ? (<div><form onSubmit={handlelogin}>
            <label>Enter email</label>
            <input placeholder="Enter email id" value={email} onChange={(e)=>setemail(e.target.value)}></input>
            <label>Enter password</label>
            <input placeholder="Enter password" value={password} onChange={(e)=>setpassword(e.target.value)}></input>
            <button type="submit">Login</button>
            </form></div>) : register ? (
            <>
              <h2 className="text-2xl font-serif text-stone-900 mb-8">Create account</h2>

              <form onSubmit={handlesubmit} className="space-y-5">
                {fields.map(({ label, type, placeholder, value, onChange }) => (
                  <div key={label}>
                    <label className="block text-xs uppercase tracking-widest text-stone-400 mb-2">
                      {label}
                    </label>
                    <input
                      type={type}
                      placeholder={placeholder}
                      value={value}
                      onChange={(e) => onChange(e.target.value)}
                      className="w-full bg-transparent border-b border-stone-300 pb-2 text-sm text-stone-800 placeholder-stone-300 outline-none focus:border-stone-800 transition-colors"
                      required
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 bg-stone-900 text-stone-50 text-xs uppercase tracking-widest py-3.5 hover:bg-stone-700 transition-colors disabled:opacity-40"
                >
                  {loading ? "Creating…" : "Register →"}
                </button>
              </form>
            </>
          ) : null}


           <button onClick={handlelogout}>Logout</button>

        </div>
      </div>
    </div>
  );
}