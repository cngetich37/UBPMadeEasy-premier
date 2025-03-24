import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
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
  const apiUrl = "https://effortlessubp-backend.onrender.com";
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const ubp = searchParams.get("ubp");
  const [data, setData] = useState(null);
  const [filterValue, setFilterValue] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [labelText, setLabelText] = useState("");

  // Function to extract the label from the business description
  const extractLabel = (businessDescription) => {
    if (!businessDescription) return "";

    // Try different regex patterns step by step
    const match = businessDescription.match(
      /(?:over\s*)?(\d+)(?:\s*[-–—]\s*\d+)?\s+([\w]+)/i
    );

    return match ? `No of ${match[2]}` : "";
  };

  // Update label when tableData changes
  useEffect(() => {
    if (tableData?.financeActs?.length > 0) {
      const firstValidRow = tableData.financeActs.find(
        (row) => row.businessDescription
      );
      // console.log("First Valid Row:", firstValidRow);
      if (firstValidRow) {
        setLabelText(extractLabel(firstValidRow.businessDescription));
      }
    }
  }, [tableData]); // Runs whenever tableData updates
  // Runs whenever tableData updates

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#F4F4F4" : "#FFFFFF",
      borderColor: state.isFocused ? "#D72638" : "#FFD700",
      boxShadow: state.isFocused
        ? "0 0 0 0.2rem rgba(6, 90, 56, 0.25)"
        : "none",
      "&:hover": {
        borderColor: state.isFocused ? "#D72638" : "#FFD700",
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#495057",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "#D72638" : "#FFFFFF",
      color: state.isFocused ? "#FFD700" : "#495057",
      "&:hover": {
        backgroundColor: state.isFocused ? "#D72638" : "#F4F4F4",
      },
    }),
    dropdownIndicator: (provided, state) => ({
      ...provided,
      color: state.isFocused ? "#D72638" : "#ADB5BD",
      "&:hover": {
        color: state.isFocused ? "#D72638" : "#495057",
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
          `https://effortlessubp-backend.onrender.com/api/naics/${encodeURIComponent(
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
        `https://effortlessubp-backend.onrender.com/api/naics/industry/${industry}`
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
        `https://effortlessubp-backend.onrender.com/api/naics/businesscategories/${businessCategory}`
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
        `https://effortlessubp-backend.onrender.com/api/naics/businesssubcategories/${businessSubCategory}`
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
        `https://effortlessubp-backend.onrender.com/api/naics/businessactivities/${businessActivity}`
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
          "https://effortlessubp-backend.onrender.com/api/naics/ubpdictionary"
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
        `https://effortlessubp-backend.onrender.com/api/naics/businessactivities/${businessActivity}`
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

    // Set background color (White)
    pdf.setFillColor("#FFFFFF");
    pdf.rect(
      0,
      0,
      pdf.internal.pageSize.getWidth(),
      pdf.internal.pageSize.getHeight(),
      "F"
    );

    const title = "UBPMadeEasy";
    const titleX = pdf.internal.pageSize.getWidth() / 2;
    const titleY = 50;

    const pageWidth = pdf.internal.pageSize.getWidth();
    const rectHeight = 40; // Adjust height as needed

    // Set fill color and draw a full-width rectangle
    pdf.setFillColor("#D72638"); // Gold
    pdf.rect(0, titleY - rectHeight / 2, pageWidth, rectHeight, "F");

    // Set text color and font
    pdf.setTextColor("#FFD700"); // Dark Green
    pdf.setFont("Times", "bold");

    // Add the title text, ensuring it's centered
    pdf.text(title, titleX, titleY, { align: "center" });
    pdf.setFontSize(40);

    // Content starting position
    let currentY = titleY + 50;

    // Business Information Table
    const tableHeaders = ["", ""];
    const tableRows = [
      [`Business: ${searchInput}`, ""],
      ["", ""],
      ["Industry", "Business Category"],
      [
        `${industryMessage} - ${industry}`,
        `${businessCategoryMessage} - ${businessCategory}`,
      ],
      ["", ""],
      ["Business Subcategory", "Business Activity"],
      [
        `${businessSubCategoryMessage} - ${businessSubCategory}`,
        `${businessActivityMessage} - ${businessActivity}`,
      ],
    ];

    pdf.autoTable({
      startY: currentY,
      margin: { top: 20, right: 10, bottom: 20, left: 5 },
      head: [tableHeaders],
      body: tableRows,
      theme: "striped",
      styles: {
        textColor: "#D72638",
        font: "Times",
        fontSize: 12,
      },
      headStyles: {
        fillColor: "#FFFFFF", // Dark green header background
        textColor: "#D72638", // Gold text
        fontStyle: "bold",
        fontSize: 14,
        halign: "center", // Center align header text
      },
      columnStyles: {
        0: { cellWidth: 300 },
        1: { cellWidth: 280 },
      },
      didDrawPage: (data) => {
        currentY = data.cursor.y + 30; // Store the position for the next table
      },
    });

    // Space between tables
    currentY += 30; // Ensuring extra space to avoid overlap

    // Title for Financial Data Table
    pdf.setFont("Times", "bold");
    pdf.setFontSize(16);
    pdf.setTextColor("#D72638");
    pdf.setFillColor("#FFFFFF");

    // Space below the second table title
    currentY += 20;

    // Financial Data Table Headers
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

    // Financial Data Table Rows
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
        }),
      ];
    });

    // Generate Financial Data Table
    pdf.autoTable({
      startY: currentY,
      margin: { top: 20, right: 10, bottom: 70, left: 5 },
      head: [tableHeadersFinance],
      body: tableRowsFinance,
      theme: "striped",
      styles: {
        textColor: "#D72638",
        fillColor: "#FFFFFF",
        font: "Arial",
        fontSize: 10,
      },
      headStyles: {
        fillColor: "#D72638",
        textColor: "#FFD700",
        fontSize: 12,
      },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 120 },
        2: { cellWidth: 60 },
        3: { cellWidth: 70 },
        4: { cellWidth: 70 },
        5: { cellWidth: 70 },
        6: { cellWidth: 60 },
        7: { cellWidth: 90 },
      },
    });

    // Generate QR Code
    const qrCodeURL = `https://ubpeasy.cnetechafrica.org/ubp?ubp=${encodeURIComponent(
      searchInput
    )}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeURL, { width: 80 });

    // Position QR Code
    const qrCodeX = pdf.internal.pageSize.getWidth() - 100;
    const qrCodeY = pdf.internal.pageSize.getHeight() - 100;

    pdf.addImage(qrCodeDataUrl, "PNG", qrCodeX, qrCodeY, 80, 80);

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

  const matchNumberRange = (description, input) => {
    // Normalize description for consistent matching
    const cleanedDescription = description.toLowerCase().trim();

    // Match explicit number ranges like "100-200" or "100 - 200"
    // Match explicit number ranges like "100-200", "100 – 200", or "from 2001 – 3000"
    const rangeMatch = cleanedDescription.match(
      /\b(?:from\s+)?(\d+)\s*[-–—]{1,2}\s*(\d+)\s*(?:sq\.?\s*m|m²)?\b/
    );
    if (rangeMatch) {
      const lowerBound = parseInt(rangeMatch[1], 10);
      const upperBound = parseInt(rangeMatch[2], 10);
      return input >= lowerBound && input <= upperBound;
    }

    // Match "Up to X employees" or "Upto X employees"
    const upToMatch = cleanedDescription.match(/\b(up to|upto)\s+(\d+)/);
    if (upToMatch) {
      const upperBound = parseInt(upToMatch[2], 10);
      return input >= 1 && input <= upperBound;
    }

    // Match "Over X employees" correctly
    const aboveMatch = cleanedDescription.match(/\babove\s+(\d+)/);
    if (aboveMatch) {
      const lowerBound = parseInt(aboveMatch[1], 10);
      return input > lowerBound; // Strictly greater than X
    }

    // Match "Less than X employees" or "less than X employees"
    const lessThanMatch = cleanedDescription.match(/\bless\s+than\s+(\d+)/i);
    if (lessThanMatch) {
      const upperBound = parseInt(lessThanMatch[1], 10);
      return input >= 1 && input < upperBound;
    }

    // Match "to employees" or "toemployees"
    const toMatch = cleanedDescription.match(/\bto\s+(\d+)/);
    if (toMatch) {
      const upperBound = parseInt(toMatch[1], 10);
      return input >= 2 && input <= upperBound;
    }

    // Check for phrases like "with X vehicle(s)" or similar.
    const vehicleMatch = cleanedDescription.match(
      /(?:with|without)\s+(\d+)\s+vehicle/
    );
    if (vehicleMatch) {
      const vehicleCount = parseInt(vehicleMatch[1], 10);
      // You can now use vehicleCount to determine if the input is related to the vehicle count.
      if (input === vehicleCount) {
        return true;
      }
    }

    // Match patterns for 'up to X seats' or similar phrasing
    // const seatMatch = cleanedDescription.match(
    //   /(?:up\s+to|with\s+up\s+to)\s+(\d+)\s+seats/
    // );
    // if (seatMatch) {
    //   const seatCount = parseInt(seatMatch[1], 10);
    //   // Check if the input matches the seat count
    //   if (input <= seatCount) {
    //     return true;
    //   }
    // }

    // Match "Over X employees" correctly
    const overMatch = cleanedDescription.match(/\bover\s+(\d+)/);
    if (overMatch) {
      const lowerBound = parseInt(overMatch[1], 10);
      return input > lowerBound; // Strictly greater than X
    }

    return false; // If no match, return false
  };

  return (
    <>
      <Helmet>
        <title>SearchUBP - Business Activity Information</title>
        <meta
          name="description"
          content="Learn how advert small formats are classified in the NairobiPay system for the Unified Business Permit application process."
        />
        <meta
          name="keywords"
          content="NAICS Code, business permit, unified Business Permit, Nairobi Pay, UBP, business activity, business category, business subcategory, industry"
        />
        <meta name="author" content="Collins Ngetich" />
      </Helmet>
      <main className="flex flex-col md:flex-row justify-center items-center min-h-screen bg-[#D72638] pt-4 pb-4 pl-2">
        <div className="flex flex-col justify-center items-center md:w-full w-full max-w-screen-5xl mr-auto ml-auto overflow-x-auto">
          <div
            id="capture"
            className="bg-white md:mb-2 md:w-3/4 w-11/12 md:h-screen h-3/4 md:mt-2 md:ml-2 p-4 rounded-md overflow-y-auto mb-16"
          >
            <header>
              <h1 className="text-2xl font-semibold text-center text-[#D72638] mb-4">
                Business Activity Information
              </h1>
            </header>

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
                      className="loading loading-spinner bg-[#FFD700] text-warning loading-md"
                      role="status"
                    />
                    <span className="hidden md:block text-[#D72638] font-bold ml-1">
                      Loading...
                    </span>
                  </div>
                ) : null}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label className="text-md text-[#D72638] font-medium">
                  Industry
                </label>
                <input
                  type="text"
                  value={`${industry}`}
                  readOnly
                  className="input input-bordered bg-white text-black p-2 rounded-md border-[#FFD700] focus:border-[#D72638] text-sm"
                />
                {industry !== "" && industryMessage && (
                  <p className="text-sm text-[#d72638]">{industryMessage}</p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-md text-[#D72638] font-medium">
                  Business Category
                </label>
                <input
                  type="text"
                  value={`${businessCategory}`}
                  readOnly
                  className="input input-bordered bg-white text-black p-2 rounded-md border-[#FFD700] focus:border-[#D72638] text-sm"
                />
                {businessCategory !== "" && businessCategoryMessage && (
                  <p className="text-sm text-[#d72638]">
                    {businessCategoryMessage}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-md text-[#D72638] font-medium">
                  Business Sub category
                </label>
                <input
                  type="text"
                  value={`${businessSubCategory}`}
                  readOnly
                  className="input input-bordered bg-white text-black text-sm p-2 rounded-md border-[#FFD700] focus:border-[#D72638]"
                />
                {businessSubCategory !== "" && businessSubCategoryMessage && (
                  <p className="text-sm text-[#d72638]">
                    {businessSubCategoryMessage}
                  </p>
                )}
              </div>
              <div className="flex flex-col">
                <label className="text-md text-[#D72638] font-medium">
                  Business Activity
                </label>
                <input
                  type="text"
                  value={`${businessActivity}`}
                  readOnly
                  className="input input-bordered bg-white text-black p-2 rounded-md border-[#FFD700] focus:border-[#D72638] text-sm"
                />
                {businessActivity !== "" && businessActivityMessage && (
                  <p className="text-sm text-[#d72638]">
                    {businessActivityMessage}
                  </p>
                )}
              </div>
            </div>

            <div className="max-w-[desired-width] overflow-x-auto mt-6">
              {/* Filter Input */}
              <div className="mt-2">
                <label
                  htmlFor="businessDescriptionFilter"
                  className="block text-sm font-medium text-[#D72638] mb-2"
                >
                  {labelText
                    .replace(/Hospitals/g, "Beds") // Replace "Hospital" with "Beds"
                    .replace(/\bsq\b/g, "sq.m")}
                </label>
                <input
                  type="text"
                  id="businessDescriptionFilter"
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="input input-bordered text-black bg-white p-2 rounded-md border-[#FFD700] focus:border-[#D72638] px-2 py-1 border  w-full md:w-1/3 mb-4 mr-4"
                />
              </div>
              {/* Table */}
              <table className="table-auto max-w-full divide-y divide-[#D72638]">
                <thead className="bg-[#D72638]">
                  <tr>
                    {[
                      "Business Description",
                      "Trade Licence",
                      "Fire Clearance",
                      "Food Hygiene",
                      "Health Certificate",
                      "Pest Control",
                      "Total",
                    ].map((header, index) => (
                      <th
                        key={index}
                        className="px-6 py-3 text-left text-xs font-semibold text-[#FFD700] uppercase tracking-wider border-b-2 border-[#FFD700] transition-all duration-300"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#D72638] text-black">
                  {tableData?.financeActs
                    ?.filter((row) => {
                      if (!filterValue) return true;
                      const inputNumber = parseInt(filterValue);
                      return (
                        !isNaN(inputNumber) &&
                        matchNumberRange(row.businessDescription, inputNumber)
                      );
                    })
                    .reduce((uniqueRows, row) => {
                      if (
                        !uniqueRows.some(
                          (uniqueRow) =>
                            uniqueRow.businessDescription ===
                            row.businessDescription
                        )
                      ) {
                        uniqueRows.push(row);
                      }
                      return uniqueRows;
                    }, [])
                    .map((row, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {row.businessDescription}
                        </td>
                        {[
                          "tradeLicence",
                          "fireClearance",
                          "foodHygiene",
                          "healthCertificate",
                          "pestControl",
                        ].map((key, i) => (
                          <td key={i} className="px-3 py-2 whitespace-nowrap">
                            {!isNaN(parseInt(row[key]))
                              ? parseInt(row[key]).toLocaleString("en-KE", {
                                  style: "currency",
                                  currency: "KES",
                                  minimumFractionDigits: 2,
                                })
                              : "KES 0.00"}
                          </td>
                        ))}
                        <td className="px-3 py-2 whitespace-nowrap">
                          {(
                            (parseInt(row.tradeLicence) || 0) +
                            (parseInt(row.fireClearance) || 0) +
                            (parseInt(row.foodHygiene) || 0) +
                            (parseInt(row.healthCertificate) || 0) +
                            (parseInt(row.pestControl) || 0)
                          ).toLocaleString("en-KE", {
                            style: "currency",
                            currency: "KES",
                            minimumFractionDigits: 2,
                          })}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => shareAsPDF(tableData)}
                className="btn bg-[#D72638] mb-8 hover:bg-[#FFD700] hover:text-[#D72638] text-[#FFD700] font-semibold py-2 px-4 rounded-md"
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
                    className="absolute top-4 right-4 text-[#D72638] font-bold text-xl"
                  >
                    ✕
                  </button>
                  <h2 className="text-[#D72638] font-bold text-2xl mb-4">
                    Missing Information
                  </h2>
                  <p className="text-lg text-red-500">{uploadMessage}</p>
                  <button
                    onClick={closeModal}
                    className="mt-4 px-4 py-2 bg-[#D72638] text-[#FFD700] rounded-md"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default SearchUBP;
