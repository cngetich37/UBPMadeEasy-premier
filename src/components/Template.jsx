import React from "react";
import SideBar from "./Sidebar";
import { Link } from "react-router-dom";

const Template = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-[#065A38] to-[#FBCC1A] pt-4 pb-4 pl-2">
      <SideBar />
      <div className="flex flex-col justify-center items-center w-full max-w-screen-5xl">
        <div className="bg-white md:mb-2 mt-6 md:w-3/4 w-11/12 md:h-screen md:mt-2 md:ml-4 p-6 rounded-md overflow-y-auto">
          <div className="flex flex-col justify-center flex-1 items-center overflow-y-auto">
           
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template;
