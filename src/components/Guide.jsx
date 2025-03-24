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

      <main className="flex justify-center items-center min-h-screen bg-[#D72638] p-6">
        <div className="flex flex-col justify-center items-center w-full max-w-screen-lg mx-auto overflow-x-auto">
          <div className="bg-[#FFFFFF] w-11/12 mt-4 md:h-screen text-center h-3/4 md:w-3/4 p-8 rounded-2xl shadow-2xl border-2 border-[#FBCC1A] overflow-y-auto mb-10">
            <header>
              <h1 className="text-[#D72638] text-5xl font-extrabold mb-6 drop-shadow-lg">
                User Guide
              </h1>
            </header>
            {/* Disclaimer */}
            <section aria-labelledby="disclaimer-title" className="mb-6">
              <h2 id="disclaimer-title" className="sr-only">
                Disclaimer
              </h2>
              <p className="text-[#D72638] text-lg font-medium italic bg-[#FFF4E5] p-4 rounded-md shadow-md">
                <span className="font-semibold text-[#F73718]">
                  Disclaimer:
                </span>{" "}
                This app should not be considered an alternative to using the{" "}
                <a
                  href="https://www.nairobiservices.go.ke/"
                  className="text-[#FFA500] hover:text-[#FF8C00] font-bold underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  NairobiPay portal
                </a>{" "}
                but rather as a resource to aid in searching for business
                activities before making a Unified Business Permit application.
              </p>
            </section>
            {/* End of Disclaimer */}
            <section
              aria-labelledby="instructions-title"
              className="bg-[#EAF7F1] p-10 rounded-md shadow-lg "
            >
              <h2
                id="instructions-title"
                className="text-[#D72638] text-3xl font-bold mb-8"
              >
                Instructions
              </h2>
              <ol className="text-[#D72638] font-medium space-y-8 text-justify list-disc list-inside">
                <li>
                  Navigate to the{" "}
                  <Link
                    to="/ubp"
                    className="text-[#FF8C00] hover:text-[#FF4500] font-bold underline"
                  >
                    Search UBP
                  </Link>{" "}
                  page and select or type a business activity.
                </li>
                <li>
                  Take note of the Industry, Business Category, Business
                  Subcategory, and the selected Business Activity.
                </li>
                <li>
                  Visit the{" "}
                  <a
                    href="https://www.nairobiservices.go.ke/"
                    className="text-[#FF8C00] hover:text-[#FF4500] font-bold underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    NairobiPay Portal
                  </a>{" "}
                  to apply for a Unified Business Permit.
                </li>
                <li>
                  On the NairobiPay Portal, go to the{" "}
                  <strong className="text-[#FF8C00]">Services</strong> section,
                  then select{" "}
                  <strong className="text-[#FF8C00]">Business Licensing</strong>{" "}
                  from the top menu and click on{" "}
                  <strong className="text-[#FF8C00]">
                    Unified Business Permit
                  </strong>
                  .
                </li>
                <li>
                  This app will be helpful on the{" "}
                  <Link
                    to="/naics"
                    className="text-[#FF8C00] hover:text-[#FF4500] font-bold underline"
                  >
                    Business Activity Information page
                  </Link>{" "}
                  during the Unified Business Permit application.
                </li>
                <li>
                  Want to learn more about Business Activity Classification?
                  Visit the{" "}
                  <Link
                    to="/naics"
                    className="text-[#FF8C00] hover:text-[#FF4500] font-bold underline"
                  >
                    classification page
                  </Link>
                  .
                </li>
              </ol>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default Guide;
