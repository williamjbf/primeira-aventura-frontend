'use client'

import React from "react";
import { FaCog } from "react-icons/fa";

const SidebarFooter: React.FC = () => (
  <div className="px-2 mb-4">
    <button className="flex items-center gap-3 px-3 py-2 hover:bg-gray-800 w-full rounded transition-colors text-white">
      <FaCog /> Configurações
    </button>
  </div>
);

export default SidebarFooter;
