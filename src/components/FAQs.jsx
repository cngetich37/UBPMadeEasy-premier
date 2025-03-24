import React, { useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import { ChevronDown, ChevronUp } from "lucide-react";

const FAQs = () => {
  const faqs = [
    {
      question: "What is Unified Business Permit?",
      answer:
        "a single permit that combines multiple licenses and permits required for a business to operate within the city.",
    },
    {
      question:
        "What should I do if my business activity is not listed in the Search UBP?",
      answer:
        "Search for a related business activity, note down the business activity code, then head over to the NairobiPay portal and select the 'Other' or 'All Other' option when choosing your business activity.",
    },
    {
      question:
        "If I am engaged in two business activities at the same location, will fire and pest control be applied only once?",
      answer:
        "Yes, if you are engaged in two business activities at the same location, fire and pest control will be applied only once.",
    },
    {
      question: "What is the validity period for a Unified Business Permit?",
      answer: "One year from the payment date.",
    },
    {
      question: "What is an outlet in reference to MPESA?",
      answer:
        "An outlet is an agent where customers can conduct transactions related to the MPESA mobile money service.",
    },
    {
      question: "What is a nozzle in reference to Petrol Station?",
      answer: "The nozzle is the part that delivers fuel to a car.",
    },
    {
      question: "What is a machine in reference to cybercafes?",
      answer:
        "A machine refers to computers and other electronic equipment like a printer or lamination machine in a cybercafe.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-6">
      {/* SEO Metadata */}
      <Helmet>
        <title>FAQs - Unified Business Permits & MPESA Outlets</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about Unified Business Permits, MPESA Outlets, Cybercafes, and Petrol Stations."
        />
        <meta
          name="keywords"
          content="Unified Business Permit, MPESA Outlets, Cybercafe Machines, Petrol Nozzle, Business FAQs"
        />
        <meta name="robots" content="index, follow" />
      </Helmet>

      {/* Header */}
      <div className="text-center max-w-3xl mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-lg md:text-xl font-light">
          Find answers to common questions regarding unified business permits,
          MPESA outlets, and more.
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="w-full max-w-4xl space-y-4">
        {faqs.map((faq, index) => (
          <motion.div
            key={index}
            className="bg-white text-[#111827] rounded-lg shadow-lg overflow-hidden border border-gray-300 hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <button
              className="w-full flex justify-between items-center p-6 text-left text-xl font-bold focus:outline-none bg-[#FFD700] text-[#111827] transition-all duration-300"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              {openIndex === index ? (
                <ChevronUp className="text-[#111827]" />
              ) : (
                <ChevronDown className="text-[#111827]" />
              )}
            </button>
            <motion.div
              className={`overflow-hidden transition-all duration-500 ease-in-out bg-gray-100 text-[#111827] ${
                openIndex === index ? "max-h-screen p-6" : "max-h-0 p-0"
              }`}
            >
              <p className="text-lg leading-relaxed">{faq.answer}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FAQs;
