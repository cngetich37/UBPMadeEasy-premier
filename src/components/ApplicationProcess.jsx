import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

const steps = [
  "Business Category",
  "Business Details",
  "Business Activity Information",
  "Business Contacts",
  "Review and Submit",
  "Payment Plan",
];

const pages = [
  <div className="p-6 bg-gray-50 rounded-lg shadow-md">
    <h1 className="text-2xl font-bold text-emerald-900 mb-4">
      Application Details
    </h1>
    <ul className="list-disc list-inside space-y-3 text-gray-700">
      <li>
        Select the application type: <strong>New</strong> or{" "}
        <strong>Renewal</strong>.
      </li>
      <li>
        Choose the nature of your business:
        <ul className="list-disc list-inside ml-6">
          <li>
            <strong>Registered/Formal</strong> (Has a Business Registration
            Number)
          </li>
          <li>
            <strong>Unregistered/Informal</strong>
          </li>
        </ul>
      </li>
      <li>
        Once you have entered the details, click <strong>Next</strong>.
      </li>
    </ul>
  </div>,
  <div className="p-6 bg-gray-50 rounded-lg shadow-md">
    <h1 className="text-2xl font-bold text-emerald-900 mb-4">
      Business Identity
    </h1>
    <ul className="list-disc list-inside space-y-3 text-gray-700">
      <li>
        Provide your business details, including <strong>Business Name</strong>{" "}
        and <strong>Branch Name</strong>.
      </li>
    </ul>
    <h1 className="text-2xl font-bold text-emerald-900 mb-4 mt-6">
      Business Location
    </h1>
    <ul className="list-disc list-inside space-y-3 text-gray-700">
      <li>Enter location details, such as:</li>
      <ul className="list-disc list-inside ml-6">
        <li>Subcounty and Ward</li>
        <li>Road/Street Name</li>
        <li>Plot/Land Parcel Number</li>
        <li>Building/Trade Complex Name</li>
        <li>Floor Number and Unit/Room/Stall Number</li>
      </ul>
      <li>
        After entering the details, click <strong>Next</strong>.
      </li>
    </ul>
  </div>,
  <div className="p-6 bg-gray-50 rounded-lg shadow-md">
    <h1 className="text-2xl font-bold text-emerald-900 mb-4">
      Business Activity
    </h1>
    <ul className="list-disc list-inside space-y-3 text-gray-700">
      <li>
        Select your{" "}
        <strong>Industry, Business Category, Business Subcategory,</strong> and{" "}
        <strong>Business Activity</strong>. Based on your selection, relevant
        permits, certificates, and licenses will be displayed.
      </li>
      <li>If applicable, add another business activity.</li>
    </ul>
    <h1 className="text-2xl font-bold text-emerald-900 mb-4 mt-6">
      Other Services
    </h1>
    <ul className="list-disc list-inside space-y-3 text-gray-700">
      <li>
        If your business requires an{" "}
        <strong>Outdoor Advertisement license</strong> (small format), select
        the checkbox under Other Services.
      </li>
      <li>
        Provide advertisement details, including:
        <ul className="list-disc list-inside ml-6">
          <li>Application type</li>
          <li>Advertisement category and subcategories</li>
          <li>Dimensions (length & width in meters)</li>
          <li>Number of faces and advertisements</li>
          <li>Any additional details</li>
        </ul>
      </li>
      <li>
        Upload a sketch of the signage structure with dimensions, or if
        renewing, the previous receipt.
      </li>
      <li>You may add another Outdoor Advertisement license if needed.</li>
      <li>
        Click <strong>Next</strong> to proceed.
      </li>
    </ul>
  </div>,
  <div className="p-6 bg-gray-50 rounded-lg shadow-md">
    <h1 className="text-2xl font-bold text-emerald-900 mb-4">
      Business Contacts
    </h1>
    <ul className="list-disc list-inside space-y-3 text-gray-700">
      <li>Provide your business contact details, including:</li>
      <ul className="list-disc list-inside ml-6">
        <li>Email Address</li>
        <li>Phone Number</li>
        <li>Postal Address & Postal Code</li>
      </ul>
    </ul>
    <h1 className="text-2xl font-bold text-emerald-900 mb-4 mt-6">
      Contact Person
    </h1>
    <ul className="list-disc list-inside space-y-3 text-gray-700">
      <li>Provide details of the contact person:</li>
      <ul className="list-disc list-inside ml-6">
        <li>Role in Business</li>
        <li>National ID Number</li>
        <li>First Name</li>
        <li>Phone Number</li>
        <li>Email Address</li>
      </ul>
      <li>
        Click <strong>Next</strong> after entering the details.
      </li>
    </ul>
  </div>,
  <div className="p-6 bg-gray-50 rounded-lg shadow-md">
    <h1 className="text-2xl font-bold text-emerald-900 mb-4">
      Review and Submit
    </h1>
    <ul className="list-disc list-inside space-y-3 text-gray-700">
      <li>Review all the entered business details carefully.</li>
      <li>
        If everything is correct, click <strong>Submit</strong>.
      </li>
    </ul>
  </div>,
  <div className="p-6 bg-gray-50 rounded-lg shadow-md">
    <h1 className="text-2xl font-bold text-emerald-900 mb-4">Payment Plan</h1>
    <ul className="list-disc list-inside space-y-3 text-gray-700">
      <li>
        Choose your preferred payment plan: <strong>Annual, Quarterly,</strong>{" "}
        etc.
      </li>
    </ul>
  </div>,
];

const ApplicationProcess = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () =>
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));
  const handleRestart = () => setActiveStep(0);

  return (
    <div>
      <Helmet>
        <title>UBP Application Process - Step-by-Step Guide</title>
        <meta
          name="description"
          content="Follow the step-by-step UBP application process to register your business easily. Ensure compliance with business registration requirements."
        />
        <meta
          name="keywords"
          content="UBP application, business registration, business licensing, permits, business compliance"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Collins Ngetich" />
      </Helmet>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 pt-4 pb-4 px-2">
        <div className="w-11/12 max-w-4xl bg-white rounded-lg shadow-xl p-6 relative overflow-hidden mb-16 md:w-3/4">
          <header>
            <h1 className="text-emerald-900 text-center text-2xl font-bold mb-6">
              UBP Application Process
            </h1>
          </header>
          <div className="hidden md:block w-full mb-6">
            <ul className="steps w-full">
              {steps.map((label, index) => (
                <li
                  key={index}
                  className={`step ${
                    activeStep >= index ? "step-primary" : ""
                  }`}
                >
                  {label}
                </li>
              ))}
            </ul>
          </div>
          <div className="border p-5 rounded shadow w-full min-h-[60vh] overflow-y-auto">
            {pages[activeStep]}
          </div>
          <div className="flex justify-between mt-6 sticky bottom-0 bg-white py-4">
            <button
              onClick={handleBack}
              disabled={activeStep === 0}
              className="btn bg-[#EAB308] text-emerald-900 disabled:opacity-50 px-6 py-2 rounded-md shadow-md"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <button
                onClick={handleNext}
                disabled={activeStep === steps.length - 1}
                className="btn bg-emerald-900 text-[#EAB308] disabled:opacity-50 px-6 py-2 rounded-md shadow-md mr-2"
              >
                <ChevronRight size={20} />
              </button>
              <button
                onClick={handleRestart}
                className="btn bg-emerald-900 text-[#EAB308] px-6 py-2 rounded-md shadow-md"
              >
                <RefreshCw size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationProcess;
