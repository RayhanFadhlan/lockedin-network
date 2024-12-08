import React from "react";
import logo from "../assets/images/logo.png";

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-4 text-sm text-gray-700 mt-8">
      <div className="max-w-full mx-auto flex flex-wrap items-center justify-center text-xs">
        <div className="flex items-center mr-0 md:mr-7">
          <img src={logo} alt="Logo" className="h-6 w-21 cursor-default" />
          <span className="cursor-default">
            &copy; {new Date().getFullYear()}
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-10 mt-4 md:mt-0">
          <span className="cursor-default">User Agreement</span>
          <span className="cursor-default">Privacy Policy</span>
          <span className="cursor-default">Community Guidelines</span>
          <span className="cursor-default">Cookie Policy</span>
          <span className="cursor-default">Copyright Policy</span>
          <span className="cursor-default">Guest Controls</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
