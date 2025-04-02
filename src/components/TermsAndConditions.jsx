import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  const generateToken = () => {
    const token = {
      value: Math.random().toString(36).substr(2),
      expiry: Date.now() + 8 * 60 * 60 * 1000, // 8 hours expiry
    };
    localStorage.setItem("authToken", JSON.stringify(token));
  };

  const handleAccept = () => {
    generateToken();
    navigate("/guide"); // Change to the desired route
  };

  const handleDeny = () => {
    localStorage.removeItem("authToken");
    navigate("/"); // Change to the desired route
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("authToken"));
    if (!token || Date.now() > token.expiry) {
      localStorage.removeItem("authToken");
      navigate("/terms"); // Redirect to terms if token is missing or expired
    }
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Terms & Conditions - UBPMadeEasy</title>
        <meta
          name="description"
          content="Review the terms and conditions for using the UBPGuide application."
        />
      </Helmet>

      <main className="flex justify-center items-center min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 p-6">
        <div className="flex flex-col justify-center items-center w-full max-w-screen-lg mx-auto">
          <div className="bg-white w-11/12 md:w-3/4 p-4 rounded-md shadow-2xl border-2 border-[#FFD700] overflow-y-auto mb-10">
            <header className="mb-6 text-center">
              <h1 className="text-emerald-900 text-5xl font-extrabold drop-shadow-lg">
                Terms & Conditions
              </h1>
            </header>

            {/* Disclaimer Section */}
            <section aria-labelledby="disclaimer-title" className="mb-6">
              <h2
                id="disclaimer-title"
                className="text-3xl font-bold text-emerald-900 mb-4"
              >
                Disclaimer
              </h2>
              <p className="text-emerald-900 text-lg font-medium bg-red-200 p-5 rounded-md shadow-md italic">
                <span className="font-semibold text-emerald-900">Notice:</span>{" "}
                This software is provided free of charge and is intended as an
                informational tool. Users should not rely on this system as an
                official source of truth. Errors or inaccuracies may exist. It
                is recommended to consult the
                <a
                  href="https://nairobi.go.ke/download/the-nairobi-city-county-finance-act2023/"
                  className="text-emerald-900 hover:text-[#A71D2D] font-bold underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {" "}
                  Finance Act 2023
                </a>{" "}
                and seek guidance from Unified Business Permit subject matter
                experts for accurate legal and regulatory information.
              </p>
            </section>
            {/* End of Disclaimer Section */}

            {/* Usage Terms Section */}
            <h2
              id="usage-title"
              className="text-3xl font-bold text-emerald-900 mb-4"
            >
              Terms & Conditions
            </h2>
            <section
              aria-labelledby="usage-title"
              className="bg-yellow-400 p-8 rounded-md shadow-lg"
            >
              <ul className="text-emerald-900 text-lg font-medium list-disc list-inside space-y-4">
                <li>
                  This software is free to use and does not require any
                  subscription or payment.
                </li>
                <li>
                  This app should not be considered an alternative to using the{" "}
                  <a
                    href="https://www.nairobiservices.go.ke/"
                    className="text-emerald-900 hover:text-[#A71D2D] font-bold underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    NairobiPay portal
                  </a>{" "}
                  but rather as a resource to aid in searching for business
                  activities before making a Unified Business Permit
                  application.
                </li>
                <li>
                  The information provided is for reference only and should not
                  be considered legally binding.
                </li>
                <li>
                  We do not guarantee the accuracy, completeness, or reliability
                  of the data presented.
                </li>
                <li>
                  Users should independently verify information before making a
                  Unified Business Permit application.
                </li>
                <li>
                  We are not liable for any losses or damages resulting from the
                  use of this software.
                </li>
              </ul>
            </section>
            {/* End of Usage Terms Section */}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-6 mt-8">
              <button
                onClick={handleAccept}
                className="bg-emerald-900 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-[#A71D2D] transition-all"
              >
                Accept
              </button>
              <button
                onClick={handleDeny}
                className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-[#111] transition-all"
              >
                Deny
              </button>
            </div>
            {/* End of Action Buttons */}
          </div>
        </div>
      </main>
    </>
  );
};

export default TermsAndConditions;