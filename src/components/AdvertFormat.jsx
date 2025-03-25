import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet";

const AdvertFormat = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const contentRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    adjustContentHeight();
  }, [filteredData]);

  const fetchData = async () => {
    try {
      const response = await fetch("/images.json");
      if (!response.ok) {
        throw new Error(
          `Failed to fetch data: ${response.status} ${response.statusText}`
        );
      }
      const jsonData = await response.json();
      setData(jsonData);
      setFilteredData(jsonData);
      adjustContentHeight();
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const adjustContentHeight = () => {
    if (contentRef.current) {
      contentRef.current.style.maxHeight = "none";
      setTimeout(() => {
        const contentHeight = contentRef.current.scrollHeight;
        const windowHeight = window.innerHeight;
        const maxContainerHeight = windowHeight * 0.8;
        if (contentHeight > maxContainerHeight) {
          contentRef.current.style.maxHeight = `${maxContainerHeight}px`;
        } else {
          contentRef.current.style.maxHeight = "none";
        }
      }, 0);
    }
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = data.filter(
      (item) =>
        item.imageName.toLowerCase().includes(searchTerm) ||
        item.imageDescription.toLowerCase().includes(searchTerm)
    );
    setFilteredData(filtered);
  };

  return (
    <main className="bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 min-h-screen flex flex-col items-center p-4">
      <Helmet>
        <title>Advert Formats - Browse advert formats</title>
        <meta
          name="description"
          content="Discover different advert formats and search for specific advert types. Browse images and descriptions for better understanding."
        />
        <meta name="author" content="Collins Ngetich" />
      </Helmet>

      <section className="bg-white w-full md:w-3/4 lg:w-2/3 p-6 rounded-xl shadow-lg min-h-screen">
        <header>
          <h1 className="text-3xl font-bold text-emerald-900 mb-4 text-center">
            Advert (Small Formats)
          </h1>
        </header>

        <div className="mb-4">
          <input
            id="search"
            type="text"
            placeholder="Search advert type..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full px-4 py-2 border border-[#111827] rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFD700]"
          />
        </div>

        <div ref={contentRef} className="overflow-y-auto max-h-[75vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <figure
                  key={item.id}
                  className="relative bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition duration-300"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.imageDescription || "Advert Image"}
                    className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                  />
                  <figcaption className="absolute bottom-0 left-0 w-full bg-[#FFD700] bg-opacity-80 text-emerald-900 p-2 text-center font-semibold truncate">
                    {item.imageDescription}
                  </figcaption>
                </figure>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No matching adverts found.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default AdvertFormat;
