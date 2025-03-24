import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import customPic from "../assets/ace.png";

const NaicsCode = () => {
  const [selectedBusinessActivity, setSelectedBusinessActivity] =
    useState(null);
  const [industry, setIndustry] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [businessSubCategory, setBusinessSubCategory] = useState("");
  const [businessActivity, setBusinessActivity] = useState("");

  useEffect(() => {
    fetchBusinessActivityDetails();
  }, []);

  const fetchBusinessActivityDetails = async () => {
    try {
      const response = await fetch(
        "https://ubpace-backend.cnetechafrica.org/api/naics/residential%20building%20construction"
      );
      const jsonBusinessActivity = await response.json();
      setSelectedBusinessActivity({
        value: jsonBusinessActivity.commonBusinessActivity,
        label: jsonBusinessActivity.commonBusinessActivity,
      });
      setIndustry(jsonBusinessActivity.industry);
      setBusinessCategory(jsonBusinessActivity.businessCategory);
      setBusinessSubCategory(jsonBusinessActivity.businessSubCategory);
      setBusinessActivity(jsonBusinessActivity.businessActivity);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <>
      {/* SEO Metadata */}
      <Helmet>
        <title>NAICS Code - Business Activity Classification</title>
        <meta
          name="description"
          content="Learn how business activities are classified in the NAICS system for the Unified Business Permit application process."
        />
        <meta
          name="keywords"
          content="NAICS Code, Business Classification, Business Permit, Nairobi Pay, Business Activity"
        />
        <meta name="author" content="Collins Ngetich" />
      </Helmet>

      <main className="flex justify-center items-center min-h-screen bg-[#065A38] px-4 py-6">
        <nav aria-label="Sidebar Navigation">{/* <SideBar /> */}</nav>

        <div className="flex flex-col justify-center items-center w-full max-w-5xl">
          <section
            className="bg-white w-11/12 md:w-3/4 h-auto md:h-screen p-6 rounded-md overflow-y-auto mb-16 shadow-lg"
            aria-labelledby="business-classification-title"
          >
            <article className="flex flex-col justify-center items-center">
              <header>
                <h1
                  id="business-classification-title"
                  className="text-[#065A38] text-center text-2xl md:text-3xl font-bold mb-4"
                >
                  Business Activity Classification
                </h1>
              </header>

              <p className="text-[#065A38] text-start mt-4">
                For example,{" "}
                <strong>
                  {selectedBusinessActivity
                    ? selectedBusinessActivity.label
                    : "Residential Building Construction"}
                </strong>
                , which has a business activity code{" "}
                <strong>{businessActivity || "N/A"}</strong>, this is how it is
                classified in the system.
              </p>

              <img
                className="w-full h-auto mt-4"
                src={customPic}
                alt="Business Activity Classification"
                loading="lazy"
              />

              <p className="text-[#065A38] italic mt-2">
                Photo Courtesy: NairobiPay
              </p>

              <p className="text-[#065A38] text-start mt-4">
                This information appears on the <strong>3rd</strong> page of the
                <strong> Unified Business Permit </strong>
                application process when selecting a business activity before
                submitting the <strong>application</strong> on the Nairobi Pay
                portal.
              </p>
            </article>
          </section>
        </div>
      </main>
    </>
  );
};

export default NaicsCode;
