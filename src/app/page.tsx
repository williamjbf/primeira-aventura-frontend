"use client";

import Sidebar from "@/components/components/Sidebar/Sidebar";
import {useEffect, useState} from "react";
import NewTableCardGrid from "@/components/components/Table/NewTableCardGrid";
import Topbar from "@/components/components/Topbar/Topbar";
import {ApiTable, buscarTables, getRecentTables} from "@/services/table";
import {TableCarousel} from "@/components/components/Table/TableCarousel";

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
  const [mesas, setMesas] = useState<ApiTable[]>([]);
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

      try {
        const data: ApiTable[] = await buscarTables({
          titulo: "",
          sistema: "",
          tags: [],
          usuario: "",
        });
        if (!mounted) return;
        console.log(data);
        setMesas(data);
        console.log(mesas);
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
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar/>

      <main className={`flex-1 overflow-y-auto bg-gray-900 rounded-l-lg`}>
        {/* Header fixo após a sidebar */}
        <Topbar scrolled={scrolled}/>

        {/* Espaço para o header fixo */}
        <div className="pt-16 px-6 max-w-7xl mx-auto space-y-10">

          <section>
            <h1 className="text-3xl font-bold">Bem-vindo à Primeira Aventura!</h1>
            <p className="mt-4 text-gray-300">
              Aqui você pode explorar suas campanhas, mesas e muito mais.
            </p>
          </section>

          {/* Bloco Mesas recentes */}
          <section>
            <h2 className="text-xl font-bold text-white mb-4">Mesas recentes</h2>
            {loading && <p className="text-gray-400">Carregando...</p>}
            {error && <p className="text-red-400">{error}</p>}
            {!loading && !error && <NewTableCardGrid tables={recentTables}/>}
          </section>

          <section className="mt-8 rounded-xl bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 p-8 shadow-lg text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Crie sua própria aventura!
            </h2>
            <p className="mt-2 text-gray-100 text-lg">
              Reúna seus amigos, escolha um sistema e dê vida às suas histórias.
            </p>
            <button
              onClick={() => {
                // Redireciona para a página de criar mesa
                window.location.href = "/mesas/criar";
              }}
              className="mt-4 px-6 py-3 rounded-lg bg-gray-100 text-gray-900 font-semibold hover:bg-gray-300 transition-colors"
            >
              Criar Mesa
            </button>
          </section>

          <section className="mt-6">
            {/* Evite envolver o carrossel em contêiner com overflow/absolute custom que interfira */}
            <TableCarousel tables={mesas}/>
          </section>


          {/* Outros conteúdos */}

          <div style={{height: "1500px"}}/>

        </div>
      </main>
    </div>
  );
}