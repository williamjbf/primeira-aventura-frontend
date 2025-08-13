'use client'

import React from "react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-3 px-3 py-2 hover:bg-gray-700 w-full rounded transition-colors text-white"
  >
    {icon}
    <span className="text-lg">{label}</span>
  </button>
);

export default SidebarItem;
