'use client'

import { FaChevronDown } from "react-icons/fa";
import {useState} from "react";

interface SidebarExpandableItemProps {
  icon: React.ReactNode;
  label: string;
  items: string[];
  maxVisible?: number;
}

const SidebarExpandableItem: React.FC<SidebarExpandableItemProps> = ({
                                                                       icon,
                                                                       label,
                                                                       items,
                                                                       maxVisible = 5,
                                                                     }) => {
  const [open, setOpen] = useState(false);

  const visibleItems = open ? items.slice(0, maxVisible) : [];

  return (
    <div>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between w-full px-3 py-2 hover:bg-gray-800 rounded text-white"
        aria-expanded={open}
        aria-controls={`${label.replace(/\s+/g, "-").toLowerCase()}-list`}
      >
        <span className="flex items-center gap-3">
          {icon}
          {label}
        </span>
        <FaChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          id={`${label.replace(/\s+/g, "-").toLowerCase()}-list`}
          className="ml-6 mt-1 space-y-1 max-h-48 overflow-y-auto pr-1"
        >
          {visibleItems.map((item, index) => (
            <li
              key={index}
              className="text-sm text-gray-300 hover:text-white cursor-pointer"
              tabIndex={0}
              role="button"
            >
              {item}
            </li>
          ))}

          {items.length > maxVisible && (
            <li className="text-sm text-blue-400 hover:underline cursor-pointer" tabIndex={0}>
              + Ver Mais
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default SidebarExpandableItem;
