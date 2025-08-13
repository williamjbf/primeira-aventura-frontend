'use client'

import React from "react";
import Image from "next/image";

const SidebarLogo: React.FC = () => (
  <div className="flex items-center gap-2 px-4 py-6 border-b border-gray-800 text-white">
    <img src="/dragon.png" alt="Logo" className="w-8 h-8" />
    <span className="font-varsity text-xl tracking-wide">Primeira Aventura</span>
  </div>
);

export default SidebarLogo;
