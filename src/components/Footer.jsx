import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-white text-[#065A38] font-medium p-4 border-t-4 border-t-[#FBCC1A]"
      role="contentinfo"
      aria-label="Footer section"
    >
      <div className="hidden md:flex justify-center">
        <p className="text-center">
          Copyright &copy; {currentYear} - All rights reserved
        </p>
      </div>
    </footer>
  );
};

export default Footer;
