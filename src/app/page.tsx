"use client";

import Sidebar from "@/components/components/Sidebar/Sidebar";
import {useEffect, useState} from "react";
import NewTableCardGrid from "@/components/components/Table/NewTableCardGrid";
import Topbar from "@/components/components/Topbar/Topbar";

export default function Home() {

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const sidebarWidth = "16rem"

  const recentTables = [
    {
      imageUrl: "https://placehold.co/600x400",
      title: "Aventura nas Montanhas",
      system: "D&D 5e",
      gmName: "Carlos",
      timeAgo: "8 minutos atrás",
    },
    {
      imageUrl: "https://placehold.co/600x400",
      title: "Mistério em Ravenloft",
      system: "D&D 5e",
      gmName: "Maria",
      timeAgo: "11 minutos atrás",
    },
    {
      imageUrl: "https://placehold.co/600x400",
      title: "Exploração Espacial",
      system: "Space RPG",
      gmName: "João",
      timeAgo: "17 minutos atrás",
    },
    {
      imageUrl: "https://placehold.co/600x400",
      title: "Reinos Perdidos",
      system: "Pathfinder",
      gmName: "Ana",
      timeAgo: "39 minutos atrás",
    },
    {
      imageUrl: "https://placehold.co/600x400",
      title: "Reinos Perdidos",
      system: "Pathfinder",
      gmName: "Ana",
      timeAgo: "39 minutos atrás",
    },
    {
      imageUrl: "https://placehold.co/600x400",
      title: "Reinos Perdidos",
      system: "Pathfinder",
      gmName: "Ana",
      timeAgo: "39 minutos atrás",
    },
    {
      imageUrl: "https://placehold.co/600x400",
      title: "Reinos Perdidos",
      system: "Pathfinder",
      gmName: "Ana",
      timeAgo: "39 minutos atrás",
    },
    {
      imageUrl: "https://placehold.co/600x400",
      title: "Aventura nas Montanhas",
      system: "D&D 5e",
      gmName: "Carlos",
      timeAgo: "8 minutos atrás",
    },
    {
      imageUrl: "https://placehold.co/600x400",
      title: "Mistério em Ravenloft",
      system: "D&D 5e",
      gmName: "Maria",
      timeAgo: "11 minutos atrás",
    },
    {
      imageUrl: "https://placehold.co/600x400",
      title: "Exploração Espacial",
      system: "Space RPG",
      gmName: "João",
      timeAgo: "17 minutos atrás",
    },
    {
      imageUrl: "https://placehold.co/600x400",
      title: "Reinos Perdidos",
      system: "Pathfinder",
      gmName: "Ana",
      timeAgo: "39 minutos atrás",
    },
    {
      imageUrl: "https://placehold.co/600x400",
      title: "Reinos Perdidos",
      system: "Pathfinder",
      gmName: "Ana",
      timeAgo: "39 minutos atrás",
    },
    {
      imageUrl: "https://placehold.co/600x400",
      title: "Reinos Perdidos",
      system: "Pathfinder",
      gmName: "Ana",
      timeAgo: "39 minutos atrás",
    },
    {
      imageUrl: "https://placehold.co/600x400",
      title: "Reinos Perdidos",
      system: "Pathfinder",
      gmName: "Ana",
      timeAgo: "39 minutos atrás",
    },

  ];


  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />

      <main className={`flex-1 overflow-y-auto bg-gray-900 rounded-l-lg`}>
        {/* Header fixo após a sidebar */}
        <Topbar scrolled={scrolled} />

        {/* Espaço para o header fixo */}
        <div className="pt-16 px-6 max-w-7xl mx-auto space-y-10">
          {/* Bloco Mesas recentes */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">
              Mesas recentes
            </h2>
            <NewTableCardGrid tables={recentTables} />
          </section>

          {/* Outros conteúdos */}
          <section>
            <h1 className="text-3xl font-bold">Bem-vindo à Primeira Aventura!</h1>
            <p className="mt-4 text-gray-300">
              Aqui você pode explorar suas campanhas, mesas e muito mais.
            </p>
            <div style={{ height: "1500px" }} />
          </section>
        </div>
      </main>
    </div>
  );
}