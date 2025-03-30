import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const Guide = () => {
  return (
    <>
      <Helmet>
        <title>User Guide - UBPGuide</title>
        <meta
          name="description"
          content="Learn how to navigate the NairobiPay Portal and apply for a Unified Business Permit. Follow step-by-step guidance on business activity classification and permit application."
        />
        <meta
          name="keywords"
          content="Unified Business Permit, NairobiPay Portal, business activity, business category, business subcategory, industry, business licensing, UBP application, NAICS classification"
        />
        <meta name="author" content="Collins Ngetich" />
      </Helmet>

      <main className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 p-6 flex justify-center items-center">
        <div className="w-full max-w-3xl bg-emerald-900 p-4 rounded-md border-4 border-yellow-500 shadow-sm shadow-yellow-500/50">
          {/* Luxurious Header */}
          <header className="mb-10 text-center">
            <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
              User Guide
            </h1>
            <div className="h-1 bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-500 w-3/4 mx-auto mt-4 rounded-full"></div>
          </header>

          {/* Luxurious Content Section */}
          <section
            aria-labelledby="instructions-title"
            className="bg-white p-8 rounded-md border border-yellow-500 shadow-lg shadow-yellow-500/30"
          >
            <h2
              id="instructions-title"
              className="text-3xl font-bold mb-6 text-center text-emerald-900"
            >
              Instructions
            </h2>

            <div className="h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-6"></div>

            <ol className="space-y-6 text-lg text-emerald-900">
              {[
                {
                  text: "Go to the ",
                  link: { to: "/ubp", text: "Search UBP" },
                  rest: " page and select a business activity.",
                },
                {
                  text: "Write down the Industry code, Business Category code, Business Subcategory code, and Business Activity code.",
                },
                {
                  text: "Visit the NairobiPay portal to apply for a Unified Business Permit.",
                },
                {
                  text: "On the NairobiPay portal, go to the ",
                  strongText: [
                    "Services",
                    "➤",
                    "Business Licensing",
                    "➤",
                    "Unified Business Permit.",
                  ],
                },
                {
                  text: "Use the Industry code, Business Category code, Business Subcategory code, and Business Activity code that you wrote down to select the correct business activity on the Business Activity Information page.",
                },
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-emerald-900 text-2xl mr-3">➤</span>
                  <span>
                    {item.text}
                    {item.link && (
                      <Link
                        to={item.link.to || "#"}
                        href={item.link.href || "#"}
                        className="text-emerald-900 font-semibold underline transition-colors"
                        target={item.link.href ? "_blank" : "_self"}
                        rel={item.link.href ? "noopener noreferrer" : ""}
                      >
                        {item.link.text}
                      </Link>
                    )}
                    {item.rest}
                    {item.strongText &&
                      item.strongText.map((text, idx) => (
                        <strong key={idx} className="text-emerald-900">
                          {" "}
                          {text}{" "}
                        </strong>
                      ))}
                  </span>
                </li>
              ))}
            </ol>

            <div className="h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent mt-8"></div>
          </section>
        </div>
      </main>
    </>
  );
};

export default Guide;
