import React, { useState, useEffect, useMemo } from "react";
import SideBar from "./Sidebar";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { Link, useLocation } from "react-router-dom";

const BusinessActivities = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activity = searchParams.get("activity");

  // Memoize filtered data
  const memoizedFilteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.businessActivity
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.businessActivityCode
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.businessTradeCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  useEffect(() => {
    if (activity) {
      setSearchQuery(activity);
    }
  }, [activity]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://ubpmadeeasy-backend.vercel.app/api/naics/businessactivities"
      );
      const jsonData = await response.json();
      setData(jsonData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleSort = (sortBy) => {
    const sortedData = [...memoizedFilteredData].sort((a, b) =>
      sortBy === "businessActivityCode"
        ? a.businessActivityCode.localeCompare(b.businessActivityCode)
        : a.businessActivity.localeCompare(b.businessActivity)
    );
    setFilteredData(sortedData);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const exportData = (format) => {
    const formattedData = memoizedFilteredData.map(
      ({ businessActivity, businessActivityCode }) => ({
        businessActivity,
        businessActivityCode,
      })
    );

    switch (format) {
      case "xlsx":
        const worksheet = XLSX.utils.json_to_sheet(formattedData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "BusinessActivities");
        const excelBuffer = XLSX.write(workbook, {
          bookType: "xlsx",
          type: "array",
        });
        saveAs(
          new Blob([excelBuffer], { type: "application/octet-stream" }),
          "business_activities.xlsx"
        );
        break;
      case "csv":
        const csvData = Papa.unparse(formattedData);
        const csvBlob = new Blob([csvData], {
          type: "text/csv;charset=utf-8;",
        });
        saveAs(csvBlob, "business_activities.csv");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <main className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#2F6A4D] via-[#4CAF50] to-[#66BB6A] pt-4 pb-4 pl-2">
        <SideBar />
        <section className="flex flex-col justify-center items-center w-full max-w-screen-5xl">
          <article className="bg-white md:mb-2 mt-6 md:w-3/4 w-11/12 h-screen md:mt-2 md:ml-4 p-6 rounded-md shadow-md overflow-hidden">
            <header>
              <h1 className="text-2xl font-semibold text-center text-[#065A38] mb-2">
                Business Activities
              </h1>
            </header>
            <div className="flex items-center max-h-[75vh] mb-4">
              <input
                type="text"
                placeholder="Search by business activity"
                value={searchQuery}
                onChange={handleSearch}
                className="px-3 py-2 w-full border border-[#FBCC1A] rounded-md focus:outline-[#FBCC1A] focus:border-[#FBCC1A] text-lg mr-2"
              />
              <button
                onClick={() => exportData("xlsx")}
                className=" text-sm bg-[#065A38] text-[#FBCC1A] font-bold py-2 px-4 rounded-md mr-2"
              >
                Export Excel
              </button>
              <button
                onClick={() => exportData("csv")}
                className="text-sm bg-[#065A38] text-[#FBCC1A] font-bold py-2 px-4 rounded-md"
              >
                Export CSV
              </button>
            </div>
            <div className="overflow-y-auto w-full max-h-[75vh]">
              {loading ? (
                <div className="text-[#065A38] text-center font-semibold italic">
                  <span className="loading loading-spinner text-warning loading-lg mt-6" />
                </div>
              ) : (
                <table className="w-full border border-[#065A38] mb-8">
                  <thead className="sticky top-0 bg-white border border-[#065A38]">
                    <tr>
                      <th className="bg-[#065A38] text-[#FBCC1A] text-md border border-[#FBCC1A] cursor-pointer">
                        Business Trade Code
                      </th>
                      <th
                        className="bg-[#065A38] text-[#FBCC1A] text-md border border-[#FBCC1A] cursor-pointer"
                        onClick={() => handleSort("businessActivityCode")}
                      >
                        Business Activity Code
                      </th>
                      <th
                        className="bg-[#065A38] text-[#FBCC1A] text-md border border-[#FBCC1A] cursor-pointer"
                        onClick={() => handleSort("businessActivity")}
                      >
                        Business Activity
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {memoizedFilteredData.map((item) => (
                      <tr
                        key={item._id}
                        className="text-[#065A38] text-md font-semibold border border-[#FBCC1A]"
                      >
                        <td className="border border-[#FBCC1A] p-2">
                          <Link
                            to={{
                              pathname: "/financeact",
                              search: `?activity=${encodeURIComponent(
                                item.businessTradeCode
                              )}`,
                            }}
                            className="link link-hover block w-full"
                          >
                            {item.businessTradeCode}
                          </Link>
                        </td>
                        <td className="border border-[#FBCC1A] p-2">
                          {item.businessActivityCode}
                        </td>
                        <td className="border border-[#FBCC1A] p-2">
                          {item.businessActivity}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </article>
        </section>
      </main>
    </>
  );
};

export default BusinessActivities;
