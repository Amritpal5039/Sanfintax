"use client";
import { Menu, X, ChevronDown } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopDropdown, setDesktopDropdown] = useState(false);
  const router = useRouter();
  const [name, setName] = useState("");
  const [loginbutton, setloginbutton] = useState(true);
  const [logoutanddashboardbutton, setlogoutanddashboardbutton] =
    useState(false);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/getuserdata");
        if (res.status === 200) {
          setName(res.data.data.Name);
        }
        setloginbutton(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        setloginbutton(true);
        setlogoutanddashboardbutton(false);
      }
    };
    fetchUser();
  }, []);
   const handlelogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/logout");

      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error: any) {
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Logout failed"
      );
    } finally {
    }
  };
  return (
    <header className="w-full flex justify-center fixed top-0 z-50 isolate">
      <div className="w-full mix-blend-difference px-6 py-4">
        {/* Top Nav */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <h1 className="text-2xl font-black tracking-tight">SanfinTax</h1>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium">
            <span className="cursor-pointer hover:opacity-70">Products</span>

            <button
              onMouseEnter={() => setDesktopDropdown(true)}
              onClick={() => setDesktopDropdown(false)}
              className="flex items-center gap-1 cursor-pointer hover:opacity-70"
            >
              Solutions <ChevronDown size={16} />
            </button>

            <span className="cursor-pointer hover:opacity-70">
              Knowledge Center
            </span>

            <span className="cursor-pointer hover:opacity-70">Company</span>
          </nav>

          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Language
            <div className="flex items-center gap-1 cursor-pointer">
              <Image
                src="https://flagcdn.com/us.svg"
                width={18}
                height={12}
                alt="US"
              />
              <ChevronDown size={14} />
            </div> */}

            <span className="cursor-pointer hover:opacity-70">Contact us</span>

            {loginbutton ? (
              <span
                className="bg-black text-white px-5 py-2 rounded-xl text-sm hover:opacity-90 "
                onClick={() => router.push("/Pages/Login")}
              >
                Login
              </span>
            ) : (
              <button
                className="bg-black text-white px-5 py-2 rounded-xl text-sm hover:opacity-90 "
                onClick={() => setlogoutanddashboardbutton((prev) => !prev)}
              >
                Hello {name}
              </button>
            )}
          </div>
          {logoutanddashboardbutton && (
            <div className="absolute top-16 right-8 flex flex-col gap-2">
            <motion.button
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-black text-white px-5 py-2 rounded-xl text-sm hover:opacity-90  "
              onClick={() => router.push("/Pages/Dashboard")}
            >
              Dashboard
            </motion.button>
            <motion.button
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-black text-white px-5 py-2 rounded-xl text-sm hover:opacity-90  " 
             onClick={handlelogout}            >
              Logout
            </motion.button>
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            title="open menu"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
          >
            <Menu size={28} />
          </button>
        </div>

        {/* Desktop Dropdown */}
        {desktopDropdown && (
          <div
            // onMouseEnter={() => setDesktopDropdown(true)}
            // onMouseLeave={() => setDesktopDropdown(false)}
            className="hidden lg:grid grid-cols-4 gap-10 mt-6 p-6 bg-[#ECEBE4] rounded-xl shadow-md mix-blend-normal text-black"
          >
            <div>
              <p className="text-xs uppercase text-gray-500 mb-3">
                Grow Out-of-App Commerce
              </p>
              <ul className="space-y-2">
                <li>Maximize Your Revenue</li>
                <li>Maximize Your Reach</li>
              </ul>

              <p className="text-xs uppercase text-gray-500 mt-6 mb-3">
                Offer More Ways To Pay
              </p>
              <ul className="space-y-2">
                <li>Accept Payments Everywhere</li>
                <li>Minimize Risk & Fraud</li>
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-500 mb-3">
                Expand Effortlessly
              </p>
              <ul className="space-y-2">
                <li>Operational Load Lifted</li>
                <li>Tax, risks & compliance handled</li>
              </ul>
            </div>

            <div>
              <p className="text-xs uppercase text-gray-500 mb-3">
                Grow With Control
              </p>
              <ul className="space-y-2">
                <li>Stay In Control</li>
                <li>Stay True to Your Brand</li>
              </ul>
            </div>

            {/* Promo Card */}
            <div className="bg-black text-white rounded-xl p-6 flex flex-col justify-end">
              <span className="text-xs border px-3 py-1 w-fit rounded-full mb-3">
                CODA PORTAL
              </span>
              <p className="text-lg font-semibold">
                Get started with Coda today
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 bg-black/40 z-50 flex justify-center pt-8 lg:hidden"
        >
          <div className="bg-[#ECEBE4] w-[90%] rounded-2xl p-6 h-fit shadow-xl">
            {/* Top */}
            <div className="flex justify-between items-center mb-6">
              {/* <h1 className="text-2xl font-black">CODA</h1> */}

              {loginbutton ? (
                <span
                  className="bg-black text-white px-5 py-2 rounded-xl text-sm hover:opacity-90 "
                  onClick={() => router.push("/Pages/Login")}
                >
                  Login
                </span>
              ) : (
                <p className="bg-black text-white px-5 py-2 rounded-xl text-sm hover:opacity-90 ">
                  {name}
                </p>
              )}

              <button title="close" onClick={() => setMobileOpen(false)}>
                <X size={26} />
              </button>
            </div>

            {/* Links */}
            <ul className="space-y-5 text-lg">
              <li className="flex justify-between items-center">
                Products <ChevronDown />
              </li>

              <li className="flex justify-between items-center">
                Solutions <ChevronDown />
              </li>

              <li className="flex justify-between items-center">
                Knowledge Center <ChevronDown />
              </li>

              <li className="flex justify-between items-center">
                Company <ChevronDown />
              </li>
            </ul>

            {/* Contact Button */}
            <div className="mt-6">
              <button className="bg-gray-400 text-white px-5 py-2 rounded-lg">
                Contact us
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
