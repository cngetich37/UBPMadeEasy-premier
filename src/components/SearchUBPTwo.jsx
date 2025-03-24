import React, { useState, useEffect } from "react";
import SideBar from "./Sidebar";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import Select from "react-select";
import "jspdf-autotable";
import axios from "axios";

function SearchUBP() {
  const [searchInput, setSearchInput] = useState("");
  const [industry, setIndustry] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [businessSubCategory, setBusinessSubCategory] = useState("");
  const [businessActivity, setBusinessActivity] = useState("");
  const [industryMessage, setIndustryMessage] = useState("");
  const [businessCategoryMessage, setBusinessCategoryMessage] = useState("");
  const [businessSubCategoryMessage, setBusinessSubCategoryMessage] =
    useState("");
  const [businessActivityMessage, setBusinessActivityMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const apiUrl = "https://ubpace-backend.cnetechafrica.org";
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ubp = searchParams.get("ubp");
  const [data, setData] = useState(null);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#F4F4F4" : "#FFFFFF",
      borderColor: state.isFocused ? "#065A38" : "#FBCC1A",
      boxShadow: state.isFocused
        ? "0 0 0 0.2rem rgba(6, 90, 56, 0.25)"
        : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#065A38" : "#FBCC1A",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#495057",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#065A38" : "#FFFFFF",
      color: state.isFocused ? "#FBCC1A" : "#495057",
      "&:hover": {
        backgroundColor: state.isFocused ? "#065A38" : "#F4F4F4",
      },
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "#065A38" : "#ADB5BD",
      "&:hover": {
        color: state.isFocused ? "#065A38" : "#495057",
      },
    }),
  };

  // Function to retrieve cached results from local storage
  const getCachedResults = (query) => {
    const cachedData = localStorage.getItem(query);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  };

  // Function to store search results in local storage
  const cacheResults = (query, data) => {
    localStorage.setItem(query, JSON.stringify(data));
  };

  // UseEffect hook to load cached results when the component mounts
  useEffect(() => {
    if (ubp && !options.some((option) => option.value === ubp)) {
      setOptions((prevOptions) => [...prevOptions, { value: ubp, label: ubp }]);
    }
    const cachedData = getCachedResults(ubp);
    if (cachedData) {
      setIndustry(cachedData.industry);
      setBusinessCategory(cachedData.businessCategory);
      setBusinessSubCategory(cachedData.businessSubCategory);
      setBusinessActivity(cachedData.businessActivity);
    }
  }, [ubp, options]);

  useEffect(() => {
    if (ubp) {
      setSearchInput(ubp);
    }
  }, [ubp]);

  useEffect(() => {
    const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
          func(...args);
        }, delay);
      };
    };

    const fetchData = async (query) => {
      try {
        setLoading(true);
        const cachedData = getCachedResults(query);
        if (cachedData) {
          setIndustry(cachedData.industry);
          setBusinessCategory(cachedData.businessCategory);
          setBusinessSubCategory(cachedData.businessSubCategory);
          setBusinessActivity(cachedData.businessActivity);
          setLoading(false);
          return;
        }
        const response = await fetch(
          `https://ubpace-backend.cnetechafrica.org/api/naics/${encodeURIComponent(
            query
          )}`
        );
        if (!response.ok) {
          throw new Error(" ");
        }
        const data = await response.json();
        setIndustry(data.industry);
        setBusinessCategory(data.businessCategory);
        setBusinessSubCategory(data.businessSubCategory);
        setBusinessActivity(data.businessActivity);
        // Cache the results
        cacheResults(query, data);
      } catch (error) {
        console.log("Something went wrong!");
      } finally {
        setLoading(false);
      }
    };

    const debouncedFetchData = debounce(fetchData, 500);

    if (searchInput !== "") {
      debouncedFetchData(searchInput);
    } else {
      clearFields();
    }
  }, [searchInput]);

  useEffect(() => {
    if (industry !== "") {
      fetchDataByIndustry();
    } else {
      clearFields();
    }
  }, [industry]);

  useEffect(() => {
    if (businessCategory !== "") {
      fetchDataByBusinessCategory();
    } else {
      clearFields();
    }
  }, [businessCategory]);

  useEffect(() => {
    if (businessSubCategory !== "") {
      fetchDataByBusinessSubCategory();
    } else {
      clearFields();
    }
  }, [businessSubCategory]);

  useEffect(() => {
    if (businessActivity !== "") {
      fetchDataByBusinessActivity();
    } else {
      clearFields();
    }
  }, [businessActivity]);

  const fetchDataByIndustry = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://ubpace-backend.cnetechafrica.org/api/naics/industry/${industry}`
      );
      const industryResponse = await response.json();
      setIndustryMessage(industryResponse.industry);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataByBusinessCategory = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://ubpace-backend.cnetechafrica.org/api/naics/businesscategories/${businessCategory}`
      );
      const businessCategoryResponse = await response.json();
      setBusinessCategoryMessage(businessCategoryResponse.businessCategory);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataByBusinessSubCategory = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://ubpace-backend.cnetechafrica.org/api/naics/businesssubcategories/${businessSubCategory}`
      );
      const businessSubCategoryResponse = await response.json();
      setBusinessSubCategoryMessage(
        businessSubCategoryResponse.businessSubCategory
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDataByBusinessActivity = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://ubpace-backend.cnetechafrica.org/api/naics/businessactivities/${businessActivity}`
      );
      const businessActivityResponse = await response.json();
      setBusinessActivityMessage(businessActivityResponse.businessActivity);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchDataByOptions = async () => {
      try {
        setLoading(true);

        // Check if options are already cached in local storage
        const cachedOptions = localStorage.getItem("options");
        if (cachedOptions) {
          setOptions(JSON.parse(cachedOptions));
          setLoading(false);
          return;
        }

        const response = await fetch(
          "https://ubpace-backend.cnetechafrica.org/api/naics/ubpdictionary"
        );
        const optionsData = await response.json();

        const fetchedOptions = optionsData.map((item) => ({
          value: item.commonBusinessActivity,
          label: item.commonBusinessActivity,
        }));

        fetchedOptions.sort((a, b) => {
          return a.label.localeCompare(b.label);
        });

        // Cache the fetched options in local storage
        localStorage.setItem("options", JSON.stringify(fetchedOptions));

        setOptions(fetchedOptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataByOptions();
  }, []);

  const clearFields = () => {
    setBusinessCategory("");
    setBusinessSubCategory("");
    setBusinessActivity("");
    setIndustryMessage("");
    setBusinessCategoryMessage("");
    setBusinessSubCategoryMessage("");
    setBusinessActivityMessage("");
  };

  const fetchTableData = async () => {
    try {
      const response = await fetch(
        `https://ubpace-backend.cnetechafrica.org/api/naics/businessactivities/${businessActivity}`
      );
      if (!response.ok) {
        throw new Error("Unable to fetch table data");
      }
      const data = await response.json();
      setTableData(data);
    } catch (error) {
      console.error("Error fetching table data:", error);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [businessActivity]);

  const shareAsPDF = async (tableData) => {
    // Check for missing values before generating the PDF
    if (
      searchInput === "" ||
      industry === "" ||
      businessCategory === "" ||
      businessSubCategory === "" ||
      businessActivity === "" ||
      !tableData
    ) {
      setUploadMessage("Please select a business activity");
      setIsModalOpen(true);
      return;
    } else {
      setUploadMessage(null);
    }

    const pdf = new jsPDF("landscape", "pt", "a5");

    // Add dark green background
    pdf.setFillColor("#FFFFFF");
    pdf.rect(
      0,
      0,
      pdf.internal.pageSize.getWidth(),
      pdf.internal.pageSize.getHeight(),
      "F"
    );

    const title = "Business Activity Information";
    const titleX = pdf.internal.pageSize.getWidth() / 2;
    const titleY = 50;
    const titleFontSize = 30;
    const titleColor = "#065A38";

    pdf.setTextColor(titleColor);
    pdf.setFont("Monotype Corsiva", "italic", "bold");
    pdf.setFontSize(titleFontSize);
    pdf.text(titleX, titleY, title, { align: "center" });

    // Starting position for content after title
    const contentStartY = titleY + 50;

    // Table for business information (instead of text)
    const tableHeaders = ["UBP", ""];
    const tableRows = [
      ["Your business:" + " " + searchInput, ""],
      ["", ""],
      ["Industry", " Business Category"],
      [
        `${industryMessage} - ${industry}`,
        `${businessCategoryMessage} - ${businessCategory}`,
      ],
      ["", ""],
      ["Business Subcategory", " Business Activity"],
      [
        `${businessSubCategoryMessage} - ${businessSubCategory}`,
        `${businessActivityMessage} - ${businessActivity}`,
      ],
    ];

    let firstTableHeight = 0; // Variable to track the height of the first table

    // Generate table for the business information
    pdf.autoTable({
      startY: contentStartY + 30, // Adjusted startY to add space below title
      margin: { top: 20, right: 10, bottom: 20, left: 5 }, // Set margins
      head: [tableHeaders],
      body: tableRows,
      theme: "grid",
      styles: {
        textColor: "#065A38", // Adjusted text color
        font: "Times",
        fontStyle: "normal",
        fontSize: 12, // Adjust font size
      },
      headStyles: {
        fillColor: "#065A38", // Dark green header background
        textColor: "#FBCC1A", // Adjusted text color
        fontStyle: "bold",
        fontSize: 14, // Header font size
      },
      columnStyles: {
        0: { cellWidth: 300 }, // Property - Adjusted width
        1: { cellWidth: 280 }, // Middle column (Value) - Increased width
        // Adjust the width for the last column (Value)
      },
      // Capture the height of the first table
      didDrawPage: (data) => {
        firstTableHeight = data.cursor.y; // Height of the first table after it's drawn
      },
    });

    // Add more space before the second table (increase this value for more space)
    const spaceBetweenTables = 100; // Adjust this value for more or less space

    // Calculate where the second table should start
    const secondTableStartY = firstTableHeight + spaceBetweenTables;

    // Table headers for the financial data
    const tableHeadersFinance = [
      "Code",
      "Business Description",
      "Trade Licence",
      "Fire Clearance",
      "Food Hygiene",
      "Health Certificate",
      "Pest Control",
      "Total (KES)",
    ];

    // Table rows for the financial data
    const tableRowsFinance = tableData.financeActs.map((row) => {
      const total =
        (parseFloat(row.tradeLicence) || 0) +
        (parseFloat(row.fireClearance) || 0) +
        (parseFloat(row.foodHygiene) || 0) +
        (parseFloat(row.healthCertificate) || 0) +
        (parseFloat(row.pestControl) || 0);

      return [
        row.subCategory,
        row.businessDescription,
        row.tradeLicence,
        row.fireClearance,
        row.foodHygiene,
        row.healthCertificate,
        row.pestControl,
        total.toLocaleString("en-KE", {
          style: "currency",
          currency: "KES",
          minimumFractionDigits: 2,
        }), // Add the total to the row
      ];
    });

    // Generate financial data table with adjusted starting position
    pdf.autoTable({
      startY: secondTableStartY, // Start the second table with calculated space
      margin: { top: 20, right: 10, bottom: 20, left: 5 }, // Set margins
      head: [tableHeadersFinance],
      body: tableRowsFinance,
      theme: "grid",
      styles: {
        textColor: "#065A38", // Adjusted text color
        font: "Arial",
        fontStyle: "normal",
        fontSize: 10, // Adjust font size
      },
      headStyles: {
        fillColor: "#065A38", // Dark green header background
        textColor: "#FBCC1A", // Adjusted text color
        fontStyle: "bold",
        fontSize: 12, // Header font size
      },
      columnStyles: {
        0: { cellWidth: 40 }, // Code
        1: { cellWidth: 120 }, // Business Description - Expanded width
        2: { cellWidth: 60 }, // Trade Licence
        3: { cellWidth: 70 }, // Fire Clearance
        4: { cellWidth: 70 }, // Food Hygiene
        5: { cellWidth: 70 }, // Health Certificate - Expanded width
        6: { cellWidth: 60 }, // Pest Control
        7: { cellWidth: 90 }, // Total (KES) - Expanded width
      },
    });
    // Generate the QR code image
    const qrCodeURL = `https://ubpeasy.cnetechafrica.org/ubp?ubp=${encodeURIComponent(
      searchInput
    )}`;
    // Replace with the URL you want to link to
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeURL, { width: 80 }); // Generate QR code

    // Add the QR code at the bottom of the page
    const qrCodeX = pdf.internal.pageSize.getWidth() - 100; // Positioning QR code
    const qrCodeY = pdf.internal.pageSize.getHeight() - 100; // 100 pt from the bottom

    pdf.addImage(qrCodeDataUrl, "PNG", qrCodeX, qrCodeY, 80, 80); // Adjust size (80x80)

    // Save the generated PDF
    pdf.save("UBPMadeEasy-UBP.pdf");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setUploadMessage(null);
  };

  const refreshData = async () => {
    try {
      // Send the first request
      await axios.get(apiUrl);
      // Send the second request
      await axios.get(apiUrl);
      // Optionally, fetch new data and update state
      const response = await axios.get(apiUrl);
      setData(response.data);
      console.log("UBPMadeEasy!");
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };
  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-[#065A38] pt-4 pb-4 pl-2">
        {/* <SideBar /> */}
        <div className="flex flex-col justify-center items-center md:w-full w-full max-w-screen-5xl mr-auto ml-auto overflow-x-auto">
          <div
            id="capture"
            className="bg-white md:mb-2 md:w-3/4 w-11/12 md:h-screen h-3/4 md:mt-2 md:ml-2 p-4 rounded-md overflow-y-auto mb-16"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-[#065A38] rounded-md shadow-lg">
              <div className="flex items-center space-x-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 shrink-0 stroke-current"
                  fill="#FBCC1A"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    stroke="#065A38"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span className="text-md text-[#FBCC1A] font-bold">
                  If delayed, click refresh and wait a few seconds.
                </span>
              </div>
              <button
                className="px-3 py-1 text-sm font-semibold bg-[#FBCC1A] text-[#065A38] rounded-md hover:bg-yellow-400 transition duration-300"
                onClick={refreshData}
              >
                Refresh
              </button>
            </div>

            <h1 className="text-2xl font-semibold text-center text-[#065A38] mb-4">
              Business Activity Information
            </h1>
            <div className="flex flex-row">
              <Select
                options={options}
                onChange={(selectedOption) =>
                  setSearchInput(selectedOption.value)
                }
                value={options.find((option) => option.value === searchInput)}
                className="md:w-1/2 w-full mb-4 mr-4"
                styles={customStyles}
                isSearchable={true}
                placeholder="Search a business activity"
                aria-label="Select a business activity"
              />
              <span>
                {loading ? (
                  <div className="flex items-center mt-2">
                    <div
                      className="loading loading-spinner bg-[#FBCC1A] text-warning loading-md"
                      role="status"
                    />
                    <span className="hidden md:block text-[#065A38] font-bold ml-1">
                      Loading...
                    </span>
                  </div>
                ) : null}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-md text-[#065A38] font-medium">
                  Industry
                </label>
                <input
                  type="text"
                  value={`${industryMessage} - ${industry}`}
                  readOnly
                  className="input input-bordered bg-white text-black p-2 rounded-md border-[#FBCC1A] focus:border-[#065A38] text-sm"
                />
                {/* {industry !== "" && industryMessage && (
                  <p className="text-sm text-green-600">{industryMessage}</p>
                )} */}
              </div>
              <div className="flex flex-col">
                <label className="text-md text-[#065A38] font-medium">
                  Business Category
                </label>
                <input
                  type="text"
                  value={`${businessCategoryMessage} - ${businessCategory}`}
                  readOnly
                  className="input input-bordered bg-white text-black p-2 rounded-md border-[#FBCC1A] focus:border-[#065A38] text-sm"
                />
                {/* {businessCategory !== "" && businessCategoryMessage && (
                  <p className="text-sm text-green-600">
                    {businessCategoryMessage}
                  </p>
                )} */}
              </div>
              <div className="flex flex-col">
                <label className="text-md text-[#065A38] font-medium">
                  Business Sub category
                </label>
                <input
                  type="text"
                  value={`${businessSubCategoryMessage} - ${businessSubCategory}`}
                  readOnly
                  className="input input-bordered bg-white text-black text-sm p-2 rounded-md border-[#FBCC1A] focus:border-[#065A38]"
                />
                {/* {businessSubCategory !== "" && businessSubCategoryMessage && (
                  <p className="text-sm text-green-600">
                    {businessSubCategoryMessage}
                  </p>
                )} */}
              </div>
              <div className="flex flex-col">
                <label className="text-md text-[#065A38] font-medium">
                  Business Activity
                </label>
                <input
                  type="text"
                  value={`${businessActivityMessage} - ${businessActivity}`}
                  readOnly
                  className="input input-bordered bg-white text-black p-2 rounded-md border-[#FBCC1A] focus:border-[#065A38] text-sm"
                />
                {/* {businessActivity !== "" && businessActivityMessage && (
                  <p className="text-sm text-green-600">
                    {businessActivityMessage}
                  </p>
                )} */}
              </div>
            </div>
            <div className="max-w-[desired-width] overflow-x-auto mt-6">
              <table className="table-auto max-w-full divide-y divide-[#065A38]">
                <caption className="text-[#065A38] font-semibold text-center text-lg sm:text-base md:text-lg lg:text-xl xl:text-2xl">
                  Finance Act
                </caption>
                <thead className="bg-[#065A38]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#FBCC1A] uppercase tracking-wider border-b-2 border-[#FBCC1A] transition-all duration-300 transform">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#FBCC1A] uppercase tracking-wider border-b-2 border-[#FBCC1A] transition-all duration-300 transform">
                      Business Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#FBCC1A] uppercase tracking-wider border-b-2 border-[#FBCC1A] transition-all duration-300 transform">
                      Trade Licence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#FBCC1A] uppercase tracking-wider border-b-2 border-[#FBCC1A] transition-all duration-300 transform">
                      Fire Clearance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#FBCC1A] uppercase tracking-wider border-b-2 border-[#FBCC1A] transition-all duration-300 transform">
                      Food Hygiene
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#FBCC1A] uppercase tracking-wider border-b-2 border-[#FBCC1A] transition-all duration-300 transform">
                      Health Certificate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#FBCC1A] uppercase tracking-wider border-b-2 border-[#FBCC1A] transition-all duration-300 transform">
                      Pest Control
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-[#FBCC1A] uppercase tracking-wider border-b-2 border-[#FBCC1A] transition-all duration-300 transform">
                      Total
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-[#065A38] w-1/2 text-black">
                  {tableData &&
                    tableData.financeActs &&
                    tableData.financeActs
                      .reduce((uniqueRows, row) => {
                        const existingRow = uniqueRows.find(
                          (uniqueRow) =>
                            uniqueRow.businessDescription ===
                            row.businessDescription
                        );
                        if (!existingRow) {
                          uniqueRows.push(row);
                        }
                        return uniqueRows;
                      }, [])
                      .map((row, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 whitespace-nowrap w-[desired-width]">
                            {row.subCategory}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap w-[desired-width]">
                            {row.businessDescription}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap w-[desired-width]">
                            {!isNaN(parseInt(row.tradeLicence))
                              ? parseInt(row.tradeLicence).toLocaleString(
                                  "en-KE",
                                  {
                                    style: "currency",
                                    currency: "KES",
                                    minimumFractionDigits: 2,
                                  }
                                )
                              : "KES 0.00"}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap w-[desired-width]">
                            {!isNaN(parseInt(row.fireClearance))
                              ? parseInt(row.fireClearance).toLocaleString(
                                  "en-KE",
                                  {
                                    style: "currency",
                                    currency: "KES",
                                    minimumFractionDigits: 2,
                                  }
                                )
                              : "KES 0.00"}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap w-[desired-width]">
                            {!isNaN(parseInt(row.foodHygiene))
                              ? parseInt(row.foodHygiene).toLocaleString(
                                  "en-KE",
                                  {
                                    style: "currency",
                                    currency: "KES",
                                    minimumFractionDigits: 2,
                                  }
                                )
                              : "KES 0.00"}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap w-[desired-width]">
                            {!isNaN(parseInt(row.healthCertificate))
                              ? parseInt(row.healthCertificate).toLocaleString(
                                  "en-KE",
                                  {
                                    style: "currency",
                                    currency: "KES",
                                    minimumFractionDigits: 2,
                                  }
                                )
                              : "KES 0.00"}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap w-[desired-width]">
                            {!isNaN(parseInt(row.pestControl))
                              ? parseInt(row.pestControl).toLocaleString(
                                  "en-KE",
                                  {
                                    style: "currency",
                                    currency: "KES",
                                    minimumFractionDigits: 2,
                                  }
                                )
                              : "KES 0.00"}
                          </td>
                          <td className="px-3 py-2 whitespace-nowrap w-[desired-width]">
                            {!isNaN(
                              (parseInt(row.tradeLicence) || 0) +
                                (parseInt(row.fireClearance) || 0) +
                                (parseInt(row.foodHygiene) || 0) +
                                (parseInt(row.healthCertificate) || 0) +
                                (parseInt(row.pestControl) || 0)
                            )
                              ? (
                                  (parseInt(row.tradeLicence) || 0) +
                                  (parseInt(row.fireClearance) || 0) +
                                  (parseInt(row.foodHygiene) || 0) +
                                  (parseInt(row.healthCertificate) || 0) +
                                  (parseInt(row.pestControl) || 0)
                                ).toLocaleString("en-KE", {
                                  style: "currency",
                                  currency: "KES",
                                  minimumFractionDigits: 2,
                                })
                              : "Ksh 0.00"}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-end mt-4">
              <button
                onClick={() => shareAsPDF(tableData)}
                className="btn bg-[#065A38] mb-8 hover:bg-[#FBCC1A] hover:text-[#065A38] text-[#FBCC1A] font-semibold py-2 px-4 rounded-md"
              >
                Download PDF
              </button>
            </div>
            {/* Modal */}
            {isModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white w-11/12 max-w-lg rounded-md shadow-lg p-6 relative">
                  <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-[#065A38] font-bold text-xl"
                  >
                    ✕
                  </button>
                  <h2 className="text-[#065A38] font-bold text-2xl mb-4">
                    Missing Information
                  </h2>
                  <p className="text-lg text-red-500">{uploadMessage}</p>
                  <button
                    onClick={closeModal}
                    className="mt-4 px-4 py-2 bg-[#065A38] text-[#FBCC1A] rounded-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchUBP;
