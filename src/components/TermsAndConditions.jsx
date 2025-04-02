import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

const generateToken = () => {
  const token = {
    value: Math.random().toString(36).slice(2),
    expiry: Date.now() + 2 * 60 * 60 * 1000, // 2 hours expiry
  };
  localStorage.setItem("authToken", JSON.stringify(token));
};

const handleAccept = (navigate) => {
  generateToken();
  navigate("/guide"); // Redirect to guide after accepting
};

const handleDeny = (navigate) => {
  localStorage.removeItem("authToken");
  navigate("/"); // Redirect to home if denied
};

const AuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = () => {
      const token = JSON.parse(localStorage.getItem("authToken"));
      if (!token || Date.now() > token.expiry) {
        localStorage.removeItem("authToken");
        navigate("/terms"); // Redirect to terms if token is missing/expired
      }
    };

    checkToken(); // Check on mount

    // Optional: Re-check token every minute
    const interval = setInterval(checkToken, 60 * 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [navigate]);

  return null;
};

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <>
      <AuthCheck /> {/* Ensures token validation runs */}
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

            {/* Usage Terms Section */}
            <h2 className="text-3xl font-bold text-emerald-900 mb-4">
              Terms & Conditions
            </h2>
            <section className="bg-yellow-400 p-8 rounded-md shadow-lg">
              <ul className="text-emerald-900 text-lg font-medium list-disc list-inside space-y-4">
                <li>
                  This software is free to use and does not require any
                  subscription or payment.
                </li>
                <li>
                  This app is intended as an aid and should not replace the
                  official NairobiPay portal.
                </li>
                <li>
                  The information provided is for reference only and is not
                  legally binding.
                </li>
                <li>
                  We do not guarantee the accuracy, completeness, or reliability
                  of the data presented.
                </li>
                <li>
                  Users should verify information independently before making a
                  Unified Business Permit application.
                </li>
                <li>
                  We are not liable for any losses or damages resulting from the
                  use of this software.
                </li>
                <li>
                  Users are responsible for ensuring the accuracy of the data
                  they input.
                </li>
                <li>
                  This application does not store sensitive personal data, and
                  users should be mindful of their inputs.
                </li>
                <li>
                  External links are provided for convenience; we are not
                  responsible for third-party content.
                </li>
                <li>
                  We reserve the right to modify or discontinue any part of this
                  software without prior notice.
                </li>
                <li>
                  This software does not provide legal, financial, or business
                  advice. Consult Unified Business Permit subject matter experts
                  for guidance.
                </li>
                <li>
                  We may terminate access to users who misuse or violate these
                  terms.
                </li>
                <li>
                  By using this software, you agree to these terms and
                  conditions.
                </li>
              </ul>
            </section>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-6 mt-8">
              <button
                onClick={() => handleAccept(navigate)}
                className="bg-emerald-900 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-[#A71D2D] transition-all"
              >
                Accept
              </button>
              <button
                onClick={() => handleDeny(navigate)}
                className="bg-red-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-[#111] transition-all"
              >
                Deny
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default TermsAndConditions;
