"use client";

import Sidebar from "@/components/components/Sidebar/Sidebar";
import {useEffect, useState} from "react";
import NewTableCardGrid from "@/components/components/Table/NewTableCardGrid";
import Topbar from "@/components/components/Topbar/Topbar";
import {TableCarousel} from "@/components/components/Table/TableCarousel";
import {apiFetch} from "@/services/api";
import {ApiTable, getRecentTables} from "@/services/table";

function getTimeAgo(dateString: string): string {
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now.getTime() - past.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return `${seconds} segundo${seconds > 1 ? "s" : ""} atrás`;
  if (minutes < 60) return `${minutes} minuto${minutes > 1 ? "s" : ""} atrás`;
  if (hours < 24) return `${hours} hora${hours > 1 ? "s" : ""} atrás`;
  return `${days} dia${days > 1 ? "s" : ""} atrás`;
}

export default function Home() {

  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentTables, setRecentTables] = useState<
    {
      imageUrl: string;
      title: string;
      system: string;
      gmName: string;
      timeAgo: string;
    }[]
  >([]);


  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const apiData = await getRecentTables();
        if (!mounted) return;
        const mapped = apiData.slice(0, 16).map((mesa: ApiTable) => ({
          imageUrl: mesa.imagem,
          title: mesa.titulo,
          system: mesa.sistema,
          gmName: mesa.mestreNome,
          timeAgo: getTimeAgo(mesa.createdAt),
        }));
        setRecentTables(mapped);
      } catch (err: any) {
        console.error("Erro ao buscar mesas recentes:", err);
        setError(err?.general || err?.message || "Erro ao carregar mesas recentes");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const mesas = [
    {
      imagem: "https://placehold.co/600x400",
      titulo: "A Sombra de Eldoria",
      resumo:
        "Em um reino antigo, forças sombrias ameaçam devorar tudo. Os jogadores devem investigar as ruínas e sobreviver a horrores indescritíveis...",
      sistema: "Tormenta20",
      organizador: "Carlos Andrade",
      tags: ["Terror", "Fantasia", "Investigação"],
    },
    {
      imagem: "https://placehold.co/600x400",
      titulo: "Caçada Sob a Lua",
      resumo:
        "Os jogadores assumem papéis de caçadores e presas, enquanto a lua cheia traz criaturas indescritíveis à vida.",
      sistema: "D&D 5e",
      organizador: "Mariana Silva",
      tags: ["Aventura", "Suspense"],
    },
    {
      imagem: "https://placehold.co/600x400",
      titulo: "Caçada Sob a Lua",
      resumo:
        "Os jogadores assumem papéis de caçadores e presas, enquanto a lua cheia traz criaturas indescritíveis à vida.",
      sistema: "D&D 5e",
      organizador: "Mariana Silva",
      tags: ["Aventura", "Suspense"],
    },
    {
      imagem: "https://placehold.co/600x400",
      titulo: "Caçada Sob a Lua",
      resumo:
        "Os jogadores assumem papéis de caçadores e presas, enquanto a lua cheia traz criaturas indescritíveis à vida.",
      sistema: "D&D 5e",
      organizador: "Mariana Silva",
      tags: ["Aventura", "Suspense"],
    },
    {
      imagem: "https://placehold.co/600x400",
      titulo: "Caçada Sob a Lua",
      resumo:
        "Os jogadores assumem papéis de caçadores e presas, enquanto a lua cheia traz criaturas indescritíveis à vida.",
      sistema: "D&D 5e",
      organizador: "Mariana Silva",
      tags: ["Aventura", "Suspense"],
    },

    // ...mais mesas
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
            <h2 className="text-xl font-bold text-white mb-4">Mesas recentes</h2>
            {loading && <p className="text-gray-400">Carregando...</p>}
            {error && <p className="text-red-400">{error}</p>}
            {!loading && !error && <NewTableCardGrid tables={recentTables} />}
          </section>

          <section>
            <h1 className="text-2xl font-bold mb-4">Mesas em Destaque</h1>
            <TableCarousel tables={mesas} />
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