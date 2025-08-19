'use client'

import React from "react";
import { FaHome, FaDiceD20, FaDungeon } from "react-icons/fa";

import SidebarLogo from "./SidebarLogo";
import SidebarItem from "./SidebarItem";
import SidebarExpandableItem from "./SidebarExpandableItem";
import SidebarFooter from "./SidebarFooter";
import {useRouter} from "next/navigation";
import Link from "next/link";

const Sidebar: React.FC = () => {

  const router = useRouter();
  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-gray-950 text-white flex flex-col border-r border-gray-700">
      <Link href="/" onClick={() => router.push("/")}>
        <SidebarLogo />
      </Link>

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        <Link href="/" onClick={() => router.push("/")}>
          <SidebarItem icon={<FaHome />} label="Home" />
        </Link>
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
