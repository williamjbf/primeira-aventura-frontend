'use client'

import React from "react";
import {FaDiceD20, FaDungeon, FaHome} from "react-icons/fa";

import SidebarLogo from "./SidebarLogo";
import SidebarItem from "./SidebarItem";
import SidebarExpandableItem from "./SidebarExpandableItem";
import SidebarFooter from "./SidebarFooter";
import {useRouter} from "next/navigation";
import Link from "next/link";
import {useAuth} from "@/contexts/AuthContext";

export default function Sidebar() {

  const router = useRouter();
  const {user, loading} = useAuth();

  const handleGoHome = () => router.push("/");

  const handleGoToTable = (id: string | number) => {
    router.push(`/table/${id}`);
  };

  const mesasAceitas = user?.subscriptions.acceptedList ?? [];
  const mesasProprias = user?.ownedTables ?? [];

  return (
    <aside className="w-64 h-screen fixed top-0 left-0 bg-gray-950 text-white flex flex-col border-r border-gray-700">
      <Link href="/" onClick={handleGoHome}>
        <SidebarLogo/>
      </Link>

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
        <Link href="/" onClick={handleGoHome}>
          <SidebarItem icon={<FaHome/>} label="Home"/>
        </Link>
        <SidebarExpandableItem
          icon={<FaDiceD20/>}
          label="Meus Jogos"
          items={mesasAceitas}
          maxVisible={5}
          getItemId={(t) => t.id}
          getItemLabel={(t) => t.titulo}
          onItemClick={(id) => handleGoToTable(id)}
        />
        <SidebarExpandableItem
          icon={<FaDungeon/>}
          label="Minhas Mesas"
          items={mesasProprias}
          maxVisible={5}
          getItemId={(t) => t.id}
          getItemLabel={(t) => t.titulo}
          onItemClick={(id) => handleGoToTable(id)}
        />

        {loading && (
          <div className="px-3 py-1 text-xs text-gray-400">Carregando suas mesas...</div>
        )}
      </nav>

      <SidebarFooter/>
    </aside>
  );
};
