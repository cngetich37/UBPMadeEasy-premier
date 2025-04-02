import React from "react";

const Footer = () => {
  return (
    <footer
      className="bg-white text-emerald-900 font-medium p-4 border-t-4 border-t-[#FFD700]"
      role="contentinfo"
      aria-label="Footer section"
    >
      <div className="hidden md:flex justify-center">
        <p className="text-md text-center italic">
          Serving Nairobians with dignity 
        </p>
      </div>
    </footer>
  );
};

export default Footer;
