import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "/UBPMadeEasy.webp";

const UBPHome = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
      <div className="w-full max-w-6xl mx-4">
        {/* Header Section */}
        <motion.header
          className="flex flex-col items-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.img
            src={logo}
            alt="UBP Logo"
            className="w-24 sm:w-32 md:w-40 mx-auto mb-4 rounded-full border-4 border-[#FFD700] shadow-lg bg-white p-1"
            whileHover={{ rotate: 5, scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#FFD700] mb-4 text-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-[#FFEC8B]">
              UBPMadeEasy
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-light max-w-2xl mx-auto text-center text-white/90 leading-relaxed">
            Your <span className="font-semibold text-[#FFD700]">simple</span> and <span className="font-semibold text-[#FFD700]">confident</span> guide through the UBP application process
          </p>
        </motion.header>

        {/* Features Section */}
        <section className="mb-12 sm:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature Card */}
            {["Step-by-Step Guide", "Document Checklist", "24/7 Support"].map((title, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 sm:p-8 border border-white/30 hover:border-[#FFD700]/50 transition-all duration-300 shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * index }}
                whileHover={{ y: -5 }}
              >
                <div className="bg-[#FFD700] w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto shadow-md">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-emerald-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-[#FFD700] mb-3 text-center">{title}</h3>
                <p className="text-white/80 text-sm sm:text-base text-center">
                  {index === 0 && "Clear, easy-to-follow instructions that walk you through each part of the UBP application."}
                  {index === 1 && "Never miss a document with our comprehensive checklist tailored for UBP applications."}
                  {index === 2 && "Get answers to your questions anytime with our dedicated support team."}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6">
            Ready to <span className="text-[#FFD700]">simplify</span> your UBP journey?
          </h2>
          <Link to="/terms" aria-label="Terms and Conditions">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(255, 215, 0, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-[#FFD700] to-[#FFEC8B] text-emerald-900 px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              aria-label="Get Started with UBP Guide"
            >
              <span className="relative z-10">Get Started Now</span>
            </motion.button>
          </Link>
        </motion.section>
      </div>
    </main>
  );
};

export default UBPHome;
