import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "/UBPMadeEasy.webp";

const UBPHome = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#D72638] to-[#A71E2D] text-white flex items-center justify-center px-4 sm:px-6 py-8 sm:py-12">
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
            Your <span className="font-semibold text-[#FFD700]">simple</span>{" "}
            and <span className="font-semibold text-[#FFD700]">confident</span>{" "}
            guide through the UBP application process
          </p>
        </motion.header>

        {/* Features Section */}
        <section className="mb-12 sm:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/20 hover:border-[#FFD700]/50 transition-all duration-300 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-[#FFD700] w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#D72638]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-3 text-center">
                Step-by-Step Guide
              </h3>
              <p className="text-white/80 text-sm sm:text-base text-center">
                Clear, easy-to-follow instructions that walk you through each
                part of the UBP application.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/20 hover:border-[#FFD700]/50 transition-all duration-300 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-[#FFD700] w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#D72638]"
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
              <h3 className="text-xl font-bold text-[#FFD700] mb-3 text-center">
                Document Checklist
              </h3>
              <p className="text-white/80 text-sm sm:text-base text-center">
                Never miss a document with our comprehensive checklist tailored
                for UBP applications.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-white/20 hover:border-[#FFD700]/50 transition-all duration-300 shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              whileHover={{ y: -5 }}
            >
              <div className="bg-[#FFD700] w-12 h-12 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#D72638]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#FFD700] mb-3 text-center">
                24/7 Support
              </h3>
              <p className="text-white/80 text-sm sm:text-base text-center">
                Get answers to your questions anytime with our dedicated support
                team.
              </p>
            </motion.div>
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
            Ready to <span className="text-[#FFD700]">simplify</span> your UBP
            journey?
          </h2>
          <Link to="/terms" aria-label="Terms and Conditions">
            <motion.button
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(255, 215, 0, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-[#FFD700] to-[#FFEC8B] text-[#D72638] px-8 sm:px-12 py-3 sm:py-4 rounded-full text-lg sm:text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              aria-label="Get Started with UBP Guide"
            >
              <span className="relative z-10">Get Started Now</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#FFEC8B] to-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></span>
            </motion.button>
          </Link>
          <p className="text-white/70 mt-4 text-sm">
           • 100% free guidance
          </p>
        </motion.section>

        {/* Trust Indicators */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 sm:gap-8 mt-12 sm:mt-16 text-white/60 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-[#FFD700]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Trusted by Nairobians
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-[#FFD700]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            98% success rate
          </div>
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-[#FFD700]"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            Nairobi, Kenya 
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default UBPHome;
