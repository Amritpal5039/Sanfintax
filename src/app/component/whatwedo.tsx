import { motion } from "framer-motion";
export default function WhatWeDo() {
    // motion.h3({
    //     initial: { opacity: 0, y: 20 },
    //     whileInView: { opacity: 1, y: 0 },
    //     transition: { duration: 0.5 },
    //   });
  return (
    <div className="pt-20 sm:pt-30 px-4 sm:px-8 md:px-12 py-6 min-h-full bg-[linear-gradient(135deg,_rgba(0,0,0,1)_53%,_rgba(255,0,0,1)_100%)] text-white overflow-hidden">
      <div>
        {/* Simple fade-up on scroll */}
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        // viewport={{ once: true }}
        className="py-4 sm:py-6 text-red-400"
      >
        WHAT WE DO
      </motion.h2>
        <motion.p
        initial={{ opacity: 0, y: -60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        // viewport={{ once: false}}
        className="text-left text-2xl sm:text-3xl md:text-4xl lg:text-5xl w-full md:w-[70%]">
          Sanfintax is your all-in-one personal financial management platform —
          built to help you track, plan, and grow your wealth with clarity and
          confidence.
        </motion.p>
      </div>

      <div className="my-5 flex space-y-10 sm:space-y-20 flex-col">
        <motion.div 
        initial={{opacity: 0,x:50}}
        whileInView={{opacity: 1,x:0}}
        transition={{ duration: 0.6 }}

        className="text-left sm:text-right">
          <h3 className="text-xl sm:text-2xl py-4 sm:py-6 italic font-sans">
            Fixed Deposit Management
          </h3>
          <p className="text-gray-300 text-sm sm:text-base">
            Fixed Deposit Tracker Store all your Fixed Deposit details in one
            place. Track maturity dates, monitor interest earned, and let
            Sanfintax automatically calculate your maturity amount — so you
            never miss a due date again.
          </p>
        </motion.div>
        <motion.div 
        initial={{opacity: 0,x:-50}}
        whileInView={{opacity: 1,x:0}}
        transition={{ duration: 0.6 }}
 className="text-left">
          <h3 className="text-xl sm:text-2xl py-4 sm:py-6 italic font-sans">
            Liability Management
          </h3>
          <p className="text-gray-300 text-sm sm:text-base">
            Liability & Expense Manager Record and categorize your monthly and
            one-time expenses — from EMIs and tuition fees to groceries and
            fuel. Get a clear view of where your money goes and how your
            liabilities compare against your assets.
          </p>
        </motion.div>
        <motion.div 
        initial={{opacity: 0,x:50}}
        whileInView={{opacity: 1,x:0}}
        transition={{ duration: 0.6 }}
className="text-left sm:text-right">
          <h3 className="text-xl sm:text-2xl py-4 sm:py-6 italic font-sans">
            Goal Planning
          </h3>
          <p className="text-gray-300 text-sm sm:text-base">
            Financial Goal Planner Set your financial targets — a new car, your
            wedding, or any big milestone. Sanfintax calculates affordable EMIs
            based on your income and tells you exactly how long it will take to
            reach your goal.
          </p>
        </motion.div>
      </div>
    </div>
  );
}