'use client'

import React from "react";
import { FaHome, FaDiceD20, FaDungeon } from "react-icons/fa";

import SidebarLogo from "./SidebarLogo";
import SidebarItem from "./SidebarItem";
import SidebarExpandableItem from "./SidebarExpandableItem";
import SidebarFooter from "./SidebarFooter";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-gray-900 text-white flex flex-col border-r border-gray-700">
      <SidebarLogo />

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        <SidebarItem icon={<FaHome />} label="Home" />
        <SidebarExpandableItem
          icon={<FaDiceD20 />}
          label="Meus Jogos"
          items={["Campanha A", "Campanha B"]}
        />
        <SidebarExpandableItem
          icon={<FaDungeon />}
          label="Minhas Mesas"
          items={["Mesa 1", "Mesa 2", "Mesa 3"]}
        />
      </nav>

      <SidebarFooter />
    </aside>
  );
};

export default Sidebar;
