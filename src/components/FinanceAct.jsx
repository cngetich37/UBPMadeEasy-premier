import React, { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";
import debounce from "lodash/debounce";
import axios from "axios";
const FinanceAct = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const apiUrl = "https://effortlessubp-backend.onrender.com";
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activity = searchParams.get("activity");

  useEffect(() => {
    if (activity) {
      setSearchQuery(activity);
      filterData(activity);
    }
  }, [activity, data]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://effortlessubp-backend.onrender.com/api/naics/financeact"
      );
      const jsonData = await response.json();
      setData(jsonData);
      setFilteredData(jsonData);
      setLoading(false); // Initialize filteredData with all data
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false); // Set loading to false in case of error
    }
  };

  const filterData = useCallback(
    (query) => {
      const filtered = data.filter(
        (item) =>
          item.subCategory.toLowerCase().includes(query.toLowerCase()) ||
          item.naicsCode.toLowerCase().includes(query.toLowerCase()) ||
          item.businessDescription.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredData(filtered);
    },
    [data]
  );

  const handleSort = (sortBy) => {
    const sortedData = [...filteredData].sort((a, b) =>
      sortBy === "naicsCode"
        ? a.naicsCode.localeCompare(b.naicsCode)
        : a.subCategory.localeCompare(b.subCategory)
    );
    setFilteredData(sortedData);
  };

  const handleSearch = debounce((query) => {
    setSearchQuery(query);
    filterData(query);
  }, 100);

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
        <title>Finance Act - Business Licensing & Compliance</title>
        <meta
          name="description"
          content="Find information on the Finance Act including business licensing, trade licenses, fire clearance, food hygiene, and more."
        />
        <meta
          name="keywords"
          content="Finance Act, Business Licensing, Trade License, Fire Clearance, Compliance, Business Regulations"
        />
        <meta name="author" content="Collins Ngetich" />
      </Helmet>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-black via-gray-900 to-black pt-4 pb-4 pl-2">
        <div className="flex justify-center w-full max-w-screen-5xl">
          <div className="bg-white md:mb-2 mt-6 md:w-3/4 w-full md:h-screen md:mt-2 md:ml-2 p-6 rounded-md shadow-md overflow-y-auto mr-2 mb-16">
            <div className="flex flex-col justify-center flex-1">
              <header>
                <h1 className="text-2xl font-semibold text-center text-[#111827] mb-2">
                  Finance Act 2023
                </h1>
              </header>

              <div className="flex items-center max-h-[75vh] mb-4">
                <input
                  type="text"
                  placeholder="Search code"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="px-3 py-2 w-full border border-[#FFD700] rounded-md focus:outline-none focus:border-[#FFD700] text-lg mr-2"
                />
                {/* <button
                  onClick={exportToExcel}
                  className="bg-[#111827] text-sm hover:bg-[#FFD700] hover:text-[#111827] text-[#FFD700] font-bold py-1 px-4 rounded-md mr-2"
                >
                  Export Excel
                </button>
                <button
                  onClick={exportToCSV}
                  className="bg-[#111827] text-sm hover:bg-[#FFD700] hover:text-[#111827] text-[#FFD700] font-bold py-1 px-4 rounded-md"
                >
                  Export CSV
                </button> */}
              </div>
              {/* Table */}
              <div className="overflow-x-auto">
                <div className="table-container  min-h-[75vh]">
                  <div className="flex justify-center items-center mt-2 mb-2">
                    {loading ? (
                      <div className="flex items-center">
                        <span className="loading loading-spinner bg-[#FFD700] loading-lg mr-2" />
                        <span className="text-[#111827] font-bold">
                          Loading Finance Act...
                        </span>
                      </div>
                    ) : null}
                  </div>

                  <table className="w-full border-collapse border border-[#FFD700]">
                    <thead className="sticky top-0 bg-[#111827]">
                      <tr>
                        <th
                          className="px-6 py-3 text-left text-xs font-semibold text-[#FFD700] uppercase tracking-wider border-b-2 border-[#FFD700] transition-all duration-300 transform "
                          onClick={() => handleSort("subCategory")}
                        >
                          Code
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#FFD700] uppercase tracking-wider border-b-2 border-[#FFD700] transition-all duration-300 transform">
                          Business Description
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#FFD700] uppercase tracking-wider border-b-2 border-[#FFD700] transition-all duration-300 transform ">
                          Trade Licence
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#FFD700] uppercase tracking-wider border-b-2 border-[#FFD700] transition-all duration-300 transform">
                          Fire Clearance
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#FFD700] uppercase tracking-wider border-b-2 border-[#FFD700] transition-all duration-300 transform ">
                          Food Hygiene
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#FFD700] uppercase tracking-wider border-b-2 border-[#FFD700] transition-all duration-300 transform ">
                          Health Certificate
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#FFD700] uppercase tracking-wider border-b-2 border-[#FFD700] transition-all duration-300 transform">
                          Pest Control
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-[#FFD700] uppercase tracking-wider border-b-2 border-[#FFD700] transition-all duration-300 transform">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((item) => (
                        <tr
                          key={item._id}
                          className="text-[#111827] text-sm font-semibold border border-[#FFD700]"
                        >
                          <td className="border border-[#FFD700] p-2">
                            {item.subCategory}
                          </td>
                          <td className="border border-[#FFD700] p-2">
                            {item.businessDescription}
                          </td>
                          <td className="border border-[#FFD700] p-2">
                            {parseInt(item.tradeLicence).toLocaleString(
                              "en-KE",
                              {
                                style: "currency",
                                currency: "KES",
                                minimumFractionDigits: 2,
                              }
                            )}
                          </td>
                          <td className="border border-[#FFD700] p-2">
                            {!isNaN(parseInt(item.fireClearance))
                              ? parseInt(item.fireClearance).toLocaleString(
                                  "en-KE",
                                  {
                                    style: "currency",
                                    currency: "KES",
                                    minimumFractionDigits: 2,
                                  }
                                )
                              : "Ksh 0.00"}
                          </td>
                          <td className="border border-[#FFD700] p-2">
                            {!isNaN(parseInt(item.foodHygiene))
                              ? parseInt(item.foodHygiene).toLocaleString(
                                  "en-KE",
                                  {
                                    style: "currency",
                                    currency: "KES",
                                    minimumFractionDigits: 2,
                                  }
                                )
                              : (0).toLocaleString("en-KE", {
                                  style: "currency",
                                  currency: "KES",
                                  minimumFractionDigits: 2,
                                })}
                          </td>
                          <td className="border border-[#FFD700] p-2">
                            {!isNaN(parseInt(item.healthCertificate))
                              ? parseInt(item.healthCertificate).toLocaleString(
                                  "en-KE",
                                  {
                                    style: "currency",
                                    currency: "KES",
                                    minimumFractionDigits: 2,
                                  }
                                )
                              : "Ksh 0.00"}
                          </td>
                          <td className="border border-[#FFD700] p-2">
                            {!isNaN(parseInt(item.pestControl))
                              ? parseInt(item.pestControl).toLocaleString(
                                  "en-KE",
                                  {
                                    style: "currency",
                                    currency: "KES",
                                    minimumFractionDigits: 2,
                                  }
                                )
                              : "Ksh 0.00"}
                          </td>
                          <td className="border border-[#FFD700] p-2">
                            {!isNaN(
                              (parseInt(item.tradeLicence) || 0) +
                                (parseInt(item.fireClearance) || 0) +
                                (parseInt(item.foodHygiene) || 0) +
                                (parseInt(item.healthCertificate) || 0) +
                                (parseInt(item.pestControl) || 0)
                            )
                              ? (
                                  (parseInt(item.tradeLicence) || 0) +
                                  (parseInt(item.fireClearance) || 0) +
                                  (parseInt(item.foodHygiene) || 0) +
                                  (parseInt(item.healthCertificate) || 0) +
                                  (parseInt(item.pestControl) || 0)
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FinanceAct;
