"use client";

import NewTableCardGrid from "@/components/components/Table/NewTableCardGrid";
import {useEffect, useState} from "react";
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

export default function RecentTablesSection() {

  const [mesas, setMesas] = useState<ApiTable[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getRecentTables();
        if (!mounted) return;
        const mapped = data.slice(0, 16).map((mesa: ApiTable) => ({
          id: mesa.id,
          imageUrl: mesa.imagem,
          title: mesa.titulo,
          system: mesa.sistema,
          gmName: mesa.mestreNome,
          timeAgo: getTimeAgo(mesa.createdAt),
        }));
        setMesas(mapped);
      } catch (err: any) {
        console.error("Erro ao buscar mesas recentes:", err);
        setError(err?.general || err?.message || "Erro ao carregar mesas recentes");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section>
      <h2 className="text-xl font-bold text-white mb-4">Mesas recentes</h2>
      {error && <p className="text-red-400">{error}</p>}
      {!error && <NewTableCardGrid tables={mesas}/>}
    </section>
  );
}