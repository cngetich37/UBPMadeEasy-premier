import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { LuSearch } from "react-icons/lu";
import { LiaSignSolid } from "react-icons/lia";
import { MdImageSearch, MdOutlineSync } from "react-icons/md";
import { ImBooks } from "react-icons/im";
import { FaMagic,FaEnvelope, FaQuestionCircle, FaListAlt } from "react-icons/fa";

const UBPNavigate = () => {
  const cards = [
    { path: "/ubp", icon: <LuSearch />, title: "Search UBP" },
    { path: "/advert", icon: <LiaSignSolid />, title: "Advert Formats" },
    { path: "/advertsearch", icon: <MdImageSearch />, title: "Search Advert" },
    { path: "/app", icon: <MdOutlineSync />, title: "UBP Process" },
    { path: "/financeact", icon: <ImBooks />, title: "Finance Act 2023" },
    { path: "/faqs", icon: <FaQuestionCircle />, title: "FAQs" },
    { path: "/naics", icon: <FaListAlt />, title: "NAICS" },
    { path: "/contact", icon: <FaEnvelope />, title: "Feedback" },
  ];

  return (
    <>
      <Helmet>
        <title>UBP Navigation - Your Guide to UBP Processes</title>
        <meta
          name="description"
          content="Easily navigate the UBP application process with an intuitive interface and helpful resources. Get started now!"
        />
        <meta
          name="keywords"
          content="UBP search, UBP application, finance act, NAICS, advert formats, FAQs"
        />
        <meta name="author" content="Collins Ngetich" />
        <meta
          property="og:title"
          content="UBP Navigation - Your Guide to UBP Processes"
        />
        <meta
          property="og:description"
          content="Easily navigate the UBP application process with an intuitive interface and helpful resources."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourwebsite.com/ubpnavigate" />
        <meta
          property="og:image"
          content="https://yourwebsite.com/ubp-preview.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="UBP Navigation - Your Guide to UBP Processes"
        />
        <meta
          name="twitter:description"
          content="Easily navigate the UBP application process with an intuitive interface and helpful resources."
        />
      </Helmet>

      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-[#065A38] to-[#2F6A4D] text-white p-6">
        <section className="text-center max-w-3xl">
          <header>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg animate-fade-in">
              UBP Navigation
            </h1>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Quickly access UBP-related information in one convenient place.
            </p>
          </header>
        </section>

        <section className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12 w-full max-w-5xl">
          {cards.map(({ path, icon, title }, index) => (
            <Link
              to={path}
              key={index}
              className="text-lg font-semibold focus:outline-none focus:ring-4 focus:ring-white/50 rounded-lg"
              aria-label={title}
            >
              <motion.article
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-[#065A38] rounded-2xl shadow-lg p-6 w-full flex flex-col items-center hover:shadow-2xl transition-all duration-300"
              >
                <span className="text-5xl mb-4 text-[#2F6A4D]">{icon}</span>
                <h2 className="text-xl font-bold text-center">{title}</h2>
              </motion.article>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
};

export default UBPNavigate;
