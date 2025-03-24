import React, { useState, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import Select from "react-select";
import jsPDF from "jspdf";
import QRCode from "qrcode";
import axios from "axios";

function SearchAdvert() {
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [advertisementCategory, setAdvertisementCategory] = useState("");
  const [length, setLength] = useState(1);
  const [width, setWidth] = useState(1);
  const [applicationFee, setApplicationFee] = useState("");
  const [firstThreeMetres, setFirstThreeMetres] = useState("");
  const [firstSquareMetres, setFirstSquareMetres] = useState("");
  const [firstTenSquareMetres, setFirstTenSquareMetres] = useState("");
  const [extraSquareMetres, setExtraSquareMetres] = useState("");
  const [licenceFee, setLicenceFee] = useState("");
  const [licenceFeeN, setLicenceFeeN] = useState("");
  const [perEachperYear, setPerEachperYear] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  const apiUrl = "https://effortlessubp-backend.onrender.com";
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const advert = searchParams.get("advert");
  const [data, setData] = useState(null);

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
        backgroundColor: state.isFocused ? "#D72638" : "#FFD700",
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

  useEffect(() => {
    // Function to initialize length and width based on search input
    const initializeDimensions = (searchInput) => {
      switch (searchInput) {
        case "Directional Signs":
          setLength(1);
          setWidth(1);
          break;
        case "Billboard":
          setLength(3);
          setWidth(1);
          break;
        case "Corporate Flags":
        case "Canvas":
        case "Call In Adverts":
          setLength(1);
          setWidth(1);
          break;
        case "Wallpainting":
        case "Window Branding":
        case "Wall Branding":
          setLength(10);
          setWidth(1);
          break;
        default:
          setLength(1);
          setWidth(1);
          break;
      }
    };

    // Call the function to initialize dimensions whenever search input changes
    initializeDimensions(searchInput);
  }, [searchInput]);

  useEffect(() => {
    if (advert && !options.some((option) => option.value === advert)) {
      setOptions((prevOptions) => [
        ...prevOptions,
        { value: advert, label: advert },
      ]);
    }
  }, [advert, options]);

  useEffect(() => {
    if (advert) {
      setSearchInput(decodeURIComponent(advert));
    }
  }, [advert]);

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
        const response = await fetch(
          `https://effortlessubp-backend.onrender.com/api/advert/${encodeURIComponent(
            query
          )}`
        );
        if (!response.ok) {
          throw new Error(" ");
        }
        const data = await response.json();
        setAdvertisementCategory(data.advertisementCategory);
        setApplicationFee(data.applicationFee);
        setFirstThreeMetres(data.firstThreeMetres);
        setFirstSquareMetres(data.firstSquareMetres);
        setFirstTenSquareMetres(data.firstTenSquareMetres);
        setExtraSquareMetres(data.extraSquareMetres);
        setPerEachperYear(data.perEachperYear);
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
      // Clear fields logic here
      setAdvertisementCategory("");
      setApplicationFee("");
      setFirstThreeMetres("");
      setFirstSquareMetres("");
      setFirstTenSquareMetres("");
      setExtraSquareMetres("");
      setPerEachperYear("");
      setLicenceFee("");
      setLicenceFeeN("");
    }
  }, [searchInput]);

  useEffect(() => {
    const fetchDataByOptions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://effortlessubp-backend.onrender.com/api/advert"
        );
        const optionsData = await response.json();

        const fetchedOptions = optionsData.map((item) => ({
          value: item.advertType,
          label: item.advertType,
        }));

        fetchedOptions.sort((a, b) => {
          return a.label.localeCompare(b.label);
        });

        setOptions(fetchedOptions);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDataByOptions();
  }, []);

  useEffect(() => {
    // Calculate the area of the advert dimension
    const advertDimension = length * width;

    let totalFee = 0;

    if (searchInput === "Directional Signs") {
      // set the state of length and width
      setLength(1);
      setWidth(1);
      // Set licenceFee to "10500"
      setLicenceFee("10500");
      totalFee = 10500;
    } else {
      // Set licenceFee to 0 for other search inputs
      setLicenceFee(0);

      // For other search inputs, calculate the licence fee
      if (searchInput === "Billboard") {
        if (advertDimension < 3) {
          setLicenceFee(0);
        } else if (advertDimension > 3) {
          const calculatedFee =
            (advertDimension - 3) * extraSquareMetres + firstThreeMetres;
          setLicenceFee(calculatedFee);
          totalFee = calculatedFee;
        } else {
          setLicenceFee(firstThreeMetres);
          totalFee = firstThreeMetres;
        }
      } else if (searchInput === "Corporate Flags") {
        setLength(1);
        setWidth(1);
        setLicenceFee(perEachperYear);
        totalFee = perEachperYear;
      } else if (searchInput === "Canvas") {
        setLength(1);
        setWidth(1);
        setLicenceFee(firstSquareMetres);
        totalFee = firstSquareMetres;
      } else if (searchInput === "Business Encroachment") {
        if (advertDimension === 1) {
          setLength(1);
          setWidth(1);
          setLicenceFee(firstSquareMetres);
          totalFee = firstSquareMetres;
        } else {
          const calculatedFee =
            (advertDimension - 1) * firstSquareMetres + firstSquareMetres;
          setLicenceFee(calculatedFee);
          totalFee = calculatedFee;
        }
      } else if (searchInput === "Call In Adverts") {
        setLength(1);
        setWidth(1);
        setLicenceFee("18200");
        totalFee = 18200;
      } else if (
        searchInput === "Wallpainting" ||
        searchInput === "Window Branding" ||
        searchInput === "Wall Branding"
      ) {
        if (advertDimension < 10) {
          setLicenceFee(0);
          totalFee = 0;
        } else if (advertDimension === 10) {
          setLicenceFee(firstTenSquareMetres);
          totalFee = firstTenSquareMetres;
        } else {
          const calculatedFee =
            (advertDimension - 10) * extraSquareMetres + firstTenSquareMetres;
          setLicenceFee(calculatedFee);
          totalFee = calculatedFee;
        }
      } else {
        if (advertDimension === 1) {
          setLicenceFee(firstSquareMetres);
          totalFee = firstSquareMetres;
        } else if (advertDimension > 1) {
          const calculatedFee =
            (advertDimension - 1) * extraSquareMetres + firstSquareMetres;
          setLicenceFee(calculatedFee);
          totalFee = calculatedFee;
        }
      }
    }

    // Add application fee to the total
    totalFee += applicationFee;

    // Set the total fee state
    setLicenceFeeN(totalFee);
  }, [
    searchInput,
    length,
    width,
    extraSquareMetres,
    firstSquareMetres,
    firstThreeMetres,
    perEachperYear,
    firstTenSquareMetres,
    applicationFee,
  ]);

  const generatePDF = async () => {
    if (
      searchInput === "" ||
      applicationFee === "" ||
      advertisementCategory === "" ||
      length === "" ||
      width === "" ||
      licenceFee === "" ||
      licenceFeeN === ""
    ) {
      setUploadMessage("Please select an advert type.");
      setIsModalOpen(true);
      return;
    } else {
      setUploadMessage(null);
    }

    // Function to format the amount as currency if it's not zero
    const formatCurrency = (amount) => {
      return amount !== 0
        ? parseFloat(amount).toLocaleString("en-KE", {
            style: "currency",
            currency: "KES",
            minimumFractionDigits: 2,
          })
        : "";
    };

    // Collect form field values
    const pdfData = {
      applicationFee: formatCurrency(applicationFee),
      advertisementCategory: advertisementCategory || "N/A",
      dimensions: `${length ? length : "N/A"} m × ${width ? width : "N/A"} m`,
      firstSquareMetres: formatCurrency(firstSquareMetres) || "N/A",
      extraSquareMetres: formatCurrency(extraSquareMetres) || "N/A",
      firstThreeMetres: formatCurrency(firstThreeMetres) || "N/A",
      firstTenSquareMetres: formatCurrency(firstTenSquareMetres) || "N/A",
      licenceFee: formatCurrency(licenceFee) || "N/A",
      licenceFeeN: formatCurrency(licenceFeeN) || "N/A",
    };

    // Initialize PDF document
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [300, 450], // Custom smaller page size (width x height)
    });

    // Define formatting constants
    const topMargin = 50;
    const leftMargin = 35;
    const titleFontSize = 20;
    const textFontSize = 12;
    const spacing = 5;

    // Set document font and style
    doc.setFontSize(titleFontSize);
    doc.setFont("Times", "Roman");

    // Set background color (white)
    doc.setFillColor("#FFFFFF");
    doc.rect(
      0,
      0,
      doc.internal.pageSize.width,
      doc.internal.pageSize.height,
      "F"
    );

    // Set text color
    doc.setTextColor("#D72638");

    // Add title aligned to the left with margin
    doc.text("UBPMadeEasy", leftMargin, topMargin);

    // Define starting Y position for additional content
    let currentY = topMargin + titleFontSize + spacing;

    // Create the table content
    const tableHeaders = ["Advert", ""];
    const tableRows = [
      ["Advertisement Category", pdfData.advertisementCategory],
      ["Advert", searchInput || "N/A"], // Default to "N/A" if empty
      ["Application Fee (New Applicant)", pdfData.applicationFee],
      ["Dimensions (Length × Width)", pdfData.dimensions],
      ["First m²", pdfData.firstSquareMetres],
      ["First 3m²", pdfData.firstThreeMetres],
      ["First 10m²", pdfData.firstTenSquareMetres],
      ["Each Extra m²", pdfData.extraSquareMetres],
      ["Licence Fee (Renewal)", pdfData.licenceFee],
      ["Licence Fee (New Applicant)", pdfData.licenceFeeN],
    ];

    // Calculate total width of the table based on column widths
    const columnWidths = [150, 120]; // Width for the "Field" and "Value" columns respectively
    const tableWidth = columnWidths.reduce((sum, width) => sum + width, 0); // Total table width
    const pageWidth = doc.internal.pageSize.width;
    const tableStartX = (pageWidth - tableWidth) / 2; // Center the table horizontally

    // Adjust startY to move the table higher on the page
    doc.autoTable({
      startY: currentY, // Remove extra spacing to push the table up
      startX: tableStartX, // Center the table horizontally
      margin: { top: 10, right: 10, bottom: 40, left: 30 }, // Reduce top margin
      head: [tableHeaders],
      body: tableRows,
      theme: "striped",
      styles: {
        textColor: "#D72638",
        font: "Arial",
        fontStyle: "normal",
        fontSize: 10,
      },
      headStyles: {
        fillColor: "#FFFFFF",
        textColor: "#FFFFFF",
        fontStyle: "bold",
        fontSize: 12,
      },
      columnStyles: {
        0: { cellWidth: 150 }, // Field column width
        1: { cellWidth: 150 }, // Value column width
      },
    });

    // Generate the QR code image
    const qrCodeURL = `https://ubpeasy.cnetechafrica.org/advertsearch?advert=${encodeURIComponent(
      searchInput
    )}`;
    const qrCodeDataUrl = await QRCode.toDataURL(qrCodeURL, { width: 80 });

    // Add the QR code at the bottom of the page
    const qrCodeX = doc.internal.pageSize.getWidth() - 100;
    const qrCodeY = doc.internal.pageSize.getHeight() - 100;

    doc.addImage(qrCodeDataUrl, "PNG", qrCodeX, qrCodeY, 80, 80);

    // Save the PDF with a professional name
    doc.save("UBPMadeEasy-Advert.pdf");
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
    } catch (error) {
      console.error("Error refreshing data:", error);
    }
  };
  return (
    <>
      <Helmet>
        <title>SearchAdvert - Advert Small formats</title>
        <meta
          name="description"
          content="Learn how advert small formats are classified in the NairobiPay system for the Unified Business Permit application process."
        />
        <meta
          name="keywords"
          content="NAICS Code, advert, unified Business Permit, Nairobi Pay, advert small formats"
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
                Outdoor Advertisement
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
                placeholder="Search advert"
                aria-label="Search advert"
              />
              <span>
                {loading ? (
                  <div className="flex items-center mt-2">
                    <div
                      className="loading loading-spinner bg-[#FFD700] text-warning loading-md"
                      role="status"
                    />
                    <span className="hidden md:block text-[#D72638] font-bold ml-1 ">
                      Loading...
                    </span>
                  </div>
                ) : null}
              </span>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:mb-0 lg:mb-0 mb-8">
              <div className="flex flex-col">
                <label className="text-md text-[#D72638] font-medium">
                  Advertisement Category
                </label>
                <input
                  type="text"
                  value={advertisementCategory}
                  readOnly
                  className="input input-bordered input-success bg-white text-black p-2 rounded-md"
                />
              </div>
              <div
                className={`flex flex-col ${
                  applicationFee === 0 ? "hidden" : ""
                }`}
              >
                <label className="text-md text-[#D72638] font-medium">
                  Application Fee(New Applicant)
                </label>
                <input
                  type="text"
                  value={
                    !isNaN(parseFloat(applicationFee))
                      ? parseFloat(applicationFee).toLocaleString("en-KE", {
                          style: "currency",
                          currency: "KES",
                          minimumFractionDigits: 2,
                        })
                      : ""
                  }
                  readOnly
                  className="input input-bordered input-success bg-white text-black p-2 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-md text-[#D72638] font-medium">
                  Length(m)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    pattern="[0-9]*"
                    value={length}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 0) {
                        setLength(value);
                      } else if (e.target.value === "") {
                        // Allow empty input, but reset the value
                        setLength("");
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp") {
                        setLength((prevLength) => prevLength + 1);
                      } else if (e.key === "ArrowDown") {
                        if (width > 0) {
                          setLength((prevLength) => prevLength - 1);
                        }
                      } else if (e.key === "Backspace") {
                        setLength("");
                      }
                    }}
                    className="input input-success bg-white text-black p-2 rounded-md w-full"
                  />
                  <div className="absolute top-2 right-2 bottom-2 flex flex-col">
                    <div className="flex justify-center w-full">
                      <kbd
                        className="px-1 py-0 rounded-md cursor-pointer text-xs text-[#FFD700] bg-[#D72638]"
                        onClick={() =>
                          setLength((prevLength) => prevLength + 1)
                        }
                      >
                        ▲
                      </kbd>
                    </div>
                    <div className="flex justify-center w-full">
                      <kbd
                        className="px-1 py-0 rounded-md cursor-pointer text-xs text-[#FFD700] bg-[#D72638]"
                        onClick={() => {
                          if (length > 0) {
                            setLength((prevLength) => prevLength - 1);
                          }
                        }}
                      >
                        ▼
                      </kbd>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-md text-[#D72638] font-medium">
                  Width(m)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    pattern="[0-9]*"
                    value={width}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 0) {
                        setWidth(value);
                      } else if (e.target.value === "") {
                        // Allow empty input, but reset the value
                        setWidth("");
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowUp") {
                        setWidth((prevWidth) => prevWidth + 1);
                      } else if (e.key === "ArrowDown") {
                        if (width > 0) {
                          setWidth((prevWidth) => prevWidth - 1);
                        }
                      } else if (e.key === "Backspace") {
                        setWidth("");
                      }
                    }}
                    className="input input-success bg-white text-black p-2 rounded-md w-full"
                  />
                  <div className="absolute top-2 right-2 bottom-2 flex flex-col">
                    <div className="flex justify-center w-full mt-0">
                      <kbd
                        className="px-1 py-0 rounded-md cursor-pointer text-xs text-[#FFD700] bg-[#D72638]"
                        onClick={() => setWidth((prevWidth) => prevWidth + 1)}
                      >
                        ▲
                      </kbd>
                    </div>
                    <div className="flex justify-center w-full">
                      <kbd
                        className="px-1 py-0 rounded-md cursor-pointer text-xs text-[#FFD700] bg-[#D72638]"
                        onClick={() => {
                          if (width > 0) {
                            setWidth((prevWidth) => prevWidth - 1);
                          }
                        }}
                      >
                        ▼
                      </kbd>
                    </div>
                  </div>
                </div>
              </div>
              {searchInput !== "" && (
                <>
                  <div
                    className={`flex flex-col ${
                      firstSquareMetres === 0 ? "hidden" : ""
                    }`}
                  >
                    <label className="text-md text-[#D72638] font-medium">
                      1st m²
                    </label>
                    <input
                      type="text"
                      value={
                        !isNaN(parseFloat(firstSquareMetres))
                          ? parseFloat(firstSquareMetres).toLocaleString(
                              "en-KE",
                              {
                                style: "currency",
                                currency: "KES",
                                minimumFractionDigits: 2,
                              }
                            )
                          : ""
                      }
                      readOnly
                      className="input input-bordered input-success bg-white text-black p-2 rounded-md"
                    />
                  </div>
                  <div
                    className={`flex flex-col ${
                      extraSquareMetres === 0 ? "hidden" : ""
                    }`}
                  >
                    <label className="text-md text-[#D72638] font-medium">
                      Each Extra m²
                    </label>
                    <input
                      type="text"
                      value={
                        !isNaN(parseFloat(extraSquareMetres))
                          ? parseFloat(extraSquareMetres).toLocaleString(
                              "en-KE",
                              {
                                style: "currency",
                                currency: "KES",
                                minimumFractionDigits: 2,
                              }
                            )
                          : ""
                      }
                      readOnly
                      className="input input-bordered input-success bg-white text-black p-2 rounded-md"
                    />
                  </div>
                  <div
                    className={`flex flex-col ${
                      firstThreeMetres === 0 ? "hidden" : ""
                    }`}
                  >
                    <label className="text-md text-[#D72638] font-medium">
                      1st 3m²
                    </label>
                    <input
                      type="text"
                      value={
                        !isNaN(parseFloat(firstThreeMetres))
                          ? parseFloat(firstThreeMetres).toLocaleString(
                              "en-KE",
                              {
                                style: "currency",
                                currency: "KES",
                                minimumFractionDigits: 2,
                              }
                            )
                          : ""
                      }
                      readOnly
                      className="input input-bordered input-success bg-white text-black p-2 rounded-md"
                    />
                  </div>
                  <div
                    className={`flex flex-col ${
                      firstTenSquareMetres === 0 ? "hidden" : ""
                    }`}
                  >
                    <label className="text-md text-[#D72638] font-medium">
                      1st 10m²
                    </label>
                    <input
                      type="text"
                      value={
                        !isNaN(parseInt(firstTenSquareMetres))
                          ? parseInt(firstTenSquareMetres).toLocaleString(
                              "en-KE",
                              {
                                style: "currency",
                                currency: "KES",
                                minimumFractionDigits: 2,
                              }
                            )
                          : ""
                      }
                      readOnly
                      className="input input-bordered input-success bg-white text-black p-2 rounded-md"
                    />
                  </div>
                </>
              )}
              <div className="flex flex-col">
                <label className="text-md text-[#D72638] font-medium">
                  Licence Fee(Renewal)
                </label>
                <input
                  type="text"
                  value={
                    !isNaN(parseInt(licenceFee))
                      ? parseInt(licenceFee).toLocaleString("en-KE", {
                          style: "currency",
                          currency: "KES",
                          minimumFractionDigits: 2,
                        })
                      : "Ksh 0.00"
                  }
                  readOnly
                  className="input input-bordered input-success bg-white text-black p-2 rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-md text-[#D72638] font-medium">
                  Licence Fee(New Applicant)
                </label>
                <input
                  type="text"
                  value={
                    !isNaN(parseInt(licenceFeeN))
                      ? parseInt(licenceFeeN).toLocaleString("en-KE", {
                          style: "currency",
                          currency: "KES",
                          minimumFractionDigits: 2,
                        })
                      : "Ksh 0.00"
                  }
                  readOnly
                  className="input input-bordered input-success bg-white text-black p-2 rounded-md"
                />
              </div>
              <div className="hidden">
                <label className="text-md text-[#D72638] font-medium">
                  Per Year, Per Each
                </label>
                <input
                  type="number"
                  value={perEachperYear}
                  readOnly
                  className="input input-bordered input-success bg-white text-black p-2 rounded-md"
                />
              </div>
            </form>
            <div className="text-green-900 mt-2 sm:mt-4 lg:mt-6 max-w-1/2 mx-auto">
              <span className="font-bold">Important Note:</span> If the{" "}
              <span className="font-semibold">length</span> and{" "}
              <span className="font-semibold">width</span> do not change when
              you press the up and down buttons, it indicates that the advert
              type carries a <span className="font-semibold">fixed rate</span>.{" "}
              <span role="img" aria-label="note">
                📝
              </span>
            </div>

            <div className="flex flex-row justify-end">
              <button
                className="btn btn-md bg-[#D72638] text-[#FFD700] rounded-md font-medium"
                onClick={generatePDF}
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

export default SearchAdvert;
