"use client";


import {FaSearch, FaUserCircle} from "react-icons/fa";

interface TopbarProps {
  scrolled: boolean;
}

const Topbar : React.FC<TopbarProps> = ({ scrolled }: { scrolled: boolean }) => {
  return (
    <header
      className={`fixed top-0 z-30 transition-border duration-300 ${
        scrolled ? "bg-gray-900 border-b border-gray-700" : ""
      } ml-64 w-full`}
    >
      <div className="flex items-center justify-end h-12 px-6 gap-4 max-w-7xl mx-auto">
        <div className="relative w-48">
          <input
            type="search"
            placeholder="Search"
            className="w-full pl-8 pr-3 py-1.5 rounded bg-gray-800 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>
        <button className="text-gray-700 hover:text-gray-400 focus:outline-none">
          <FaUserCircle size={28} />
        </button>
      </div>
    </header>
  );
}

export default Topbar;