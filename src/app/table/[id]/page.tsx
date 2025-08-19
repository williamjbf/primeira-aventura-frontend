"use client";

import Sidebar from "@/components/components/Sidebar/Sidebar";
import Topbar from "@/components/components/Topbar/Topbar";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {ApiTable, buscarMesaPorId} from "@/services/table";
import {useAuth} from "@/contexts/AuthContext";

interface MesaDetalhes extends ApiTable {
  historico: { id: number; titulo: string; data: string }[];
}

export default function TableDetailsPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mesa, setMesa] = useState<MesaDetalhes | null>(null);
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    const fetchMesa = async () => {
      try {
        const data = await buscarMesaPorId(id);

        // enquanto não existir histórico no backend, adiciona mock aqui
        const mesaComHistorico: MesaDetalhes = {
          ...data,
          historico: [
            { id: 1, titulo: "Sessão 1: Chegada à Baróvia", data: "10/08/2025" },
            { id: 2, titulo: "Sessão 2: A Taverna da Aldeia", data: "17/08/2025" },
          ],
        };

        setMesa(mesaComHistorico);
      } catch (error) {
        console.error("Erro ao carregar mesa:", error);
      }
    };

    if (id) fetchMesa();
  }, [id]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!mesa) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Carregando mesa...
      </div>
    );
  }

  const renderBotoes = () => {
    if (user?.id === mesa.narrador.id) {
      return (
        <div className="flex gap-3">
          <button
            // onClick={handleEditar}
            className="px-6 py-2 bg-yellow-600 rounded-lg text-white hover:bg-yellow-500"
          >
            Editar
          </button>
          <button
            // onClick={handleExcluir}
            className="px-6 py-2 bg-red-600 rounded-lg text-white hover:bg-red-500"
          >
            Excluir
          </button>
        </div>
      );
    }

    // (exemplo futuro) Se for jogador já inscrito:
    // if (user && mesa.jogadores?.some(j => j.id === user.id)) {
    //   return (
    //     <button
    //       disabled
    //       className="px-6 py-2 bg-gray-600 rounded-lg text-gray-300 cursor-not-allowed"
    //     >
    //       Já inscrito
    //     </button>
    //   );
    // }

    return (
      <button
        // onClick={handleInscrever}
        className="px-6 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500"
      >
        Inscrever-se
      </button>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />

      <main className="flex-1 overflow-y-auto ml-64 bg-gray-900 rounded-l-lg pb-10">
        {/* Hero */}
        <div className="relative h-[400px] w-full-64">
          <div
            className="absolute inset-0 bg-cover bg-top"
            style={{ backgroundImage: `url(${mesa.imagem})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-gray-900" />
        </div>

        {/* Topbar fixa */}
        <Topbar scrolled={scrolled} />

        {/* Conteúdo sobrepondo hero */}
        <div className="relative z-10 -mt-32 px-6 max-w-7xl mx-auto space-y-10">
          {/* Primeira seção */}
          <section className="flex gap-8">
            {/* Imagem */}
            <div>
              <img
                src={mesa.imagem}
                alt={mesa.titulo}
                className="rounded-xl shadow-lg"
              />
            </div>

            {/* Info principal */}
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div>
                <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                  {mesa.titulo}
                </h1>
                <p className="text-lg text-gray-300 mt-2">
                  Narrador: <span className="text-indigo-400 font-semibold">{mesa.narrador.nome}</span>
                </p>
                <p className="text-lg text-gray-300">
                  Sistema: <span className="text-indigo-400 font-medium">{mesa.sistema}</span>
                </p>
              </div>

              <div>
                <div>
                  {renderBotoes()}
                </div>

                {/* Tags */}
                <div className="flex gap-2 mt-4 flex-wrap">
                  {mesa.tags.map((tag) => (
                    <span
                      key={tag.id}
                      className="px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-sm"
                    >
                      {tag.nome}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Segunda seção */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Resumo</h2>
            <div className="max-h-40 overflow-y-auto p-4 rounded-lg text-gray-300">
              {mesa.resumo}
            </div>
          </section>

          {/* Terceira seção */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Info da mesa */}
            <div className="p-6 rounded-xl space-y-3">
              <h3 className="text-xl font-semibold text-white">Informações</h3>
              <p className="text-gray-300">
                Narrador: <span className="text-indigo-400">{mesa.narrador.nome}</span>
              </p>
              <p className="text-gray-300">Sistema: {mesa.sistema}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {mesa.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 rounded-full bg-gray-700 text-gray-300 text-sm"
                  >
                    {tag.nome}
                  </span>
                ))}
              </div>
            </div>

            {/* Histórico de sessões */}
            <div className="p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-4">
                Histórico de Sessões
              </h3>
              <ul className="space-y-2">
                {mesa.historico.map((sessao) => (
                  <li key={sessao.id}>
                    <button className="w-full text-left p-3 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600">
                      <span className="font-medium">{sessao.titulo}</span>
                      <span className="block text-sm text-gray-400">
                        {sessao.data}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
