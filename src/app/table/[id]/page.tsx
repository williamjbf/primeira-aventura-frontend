"use client";

import Sidebar from "@/components/components/Sidebar/Sidebar";
import Topbar from "@/components/components/Topbar/Topbar";
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {ApiTable, buscarMesaPorId, salvarMesa, SaveTableRequest} from "@/services/table";
import {useAuth} from "@/contexts/AuthContext";

interface MesaDetalhes extends ApiTable {
  historico: { id: number; titulo: string; data: string }[];
  horario?: { dia: string; hora: string };
  local?: string;
  previewUrl?: string;
}

const diasSemana = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];

const tagsMock = [
  {id: 1, nome: "Fantasia"},
  {id: 2, nome: "Terror"},
  {id: 3, nome: "Sci-Fi"},
  {id: 4, nome: "Suspense"},
  {id: 5, nome: "Aventura"},
  {id: 6, nome: "Comédia"},
  {id: 7, nome: "Mistério"},
  {id: 8, nome: "Drama"},
  {id: 9, nome: "Cyberpunk"},
  {id: 10, nome: "Steampunk"}
]

export default function TableDetailsPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mesa, setMesa] = useState<MesaDetalhes | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const {user} = useAuth();
  const {id} = useParams<{ id: string }>();

  useEffect(() => {
    const fetchMesa = async () => {
      try {
        const data = await buscarMesaPorId(id);

        const mesaComHistorico: MesaDetalhes = {
          ...data,
          historico: [
            {id: 1, titulo: "Sessão 1: Chegada à Baróvia", data: "10/08/2025"},
            {id: 2, titulo: "Sessão 2: A Taverna da Aldeia", data: "17/08/2025"},
          ],
          horario: {dia: "Sábado", hora: "20:00"},
          local: "Discord / Roll20",
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

  const handleSave = async () => {
    if (!mesa) return;
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("id", mesa.id);
      formData.append("titulo", mesa.titulo);
      formData.append("sistema", mesa.sistema);
      formData.append("resumo", mesa.resumo);
      formData.append("narradorId", mesa.narrador.id);
      formData.append("tags", JSON.stringify(mesa.tags.map((t) => t.id)));

      if (mesa.local) formData.append("local", mesa.local);
      if (mesa.horario) formData.append("horario", JSON.stringify(mesa.horario));

      if (mesa.imagem instanceof File) {
        formData.append("imagem", mesa.imagem);
      } else {}

      console.log(formData);

      await salvarMesa(formData);

      setIsEditing(false);
    } catch (err) {
      console.error("Erro ao salvar mesa:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handler genérico para edição
  const handleChange = (field: keyof MesaDetalhes, value: any) => {
    setMesa((prev) => (prev ? {...prev, [field]: value} : prev));
  };

  const renderBotoes = () => {
    if (user?.id === mesa.narrador.id) {
      return isEditing ? (
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-green-600/50 rounded-lg text-white hover:bg-green-500"
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
          <button
            // onClick={handleExcluir}
            className="px-6 py-2 bg-red-600/50 rounded-lg text-white hover:bg-red-500"
          >
            Excluir
          </button>
          <button
            onClick={() => setIsEditing(false)}
            className="px-6 py-2 bg-gray-600 rounded-lg text-white hover:bg-gray-500"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500"
        >
          Editar
        </button>
      );
    }
    return (
      <button className="px-6 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500">
        Inscrever-se
      </button>
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar/>

      <main className="flex-1 overflow-y-auto ml-64 bg-gray-900 rounded-l-lg pb-10">
        {/* Hero */}
        <div className="relative h-[400px] w-full-64">
          <div
            className="absolute inset-0 bg-cover bg-top"
            style={{backgroundImage: `url(${mesa.previewUrl ||`http://localhost:8080${mesa.imagem}`})`}}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-gray-900"/>
        </div>

        {/* Topbar fixa */}
        <Topbar scrolled={scrolled}/>

        {/* Conteúdo sobrepondo hero */}
        <div className="relative z-10 -mt-32 px-6 max-w-7xl mx-auto space-y-10">
          <section className="flex gap-8">
            {/* Imagem */}
            <div className="flex flex-col gap-2">
              <img
                src={mesa.previewUrl || `http://localhost:8080${mesa.imagem}`}
                alt={mesa.titulo}
                className="rounded-xl shadow-lg w-64 h-64 object-cover"
              />
              {isEditing && (
                <input
                  type="file"
                  accept="image/*"
                  className="text-gray-300 text-sm"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const url = URL.createObjectURL(file);

                    setMesa((prev) =>
                      prev
                        ? { ...prev, imagem: file, previewUrl: url }
                        : prev
                    );
                  }}
                />
              )}
            </div>

            {/* Info principal */}
            <div className="flex-1 flex flex-col justify-between space-y-4">
              <div>
                {isEditing ? (
                  <input
                    type="text"
                    defaultValue={mesa.titulo}
                    className="text-4xl font-extrabold bg-transparent border-b border-gray-700 text-white tracking-tight drop-shadow-md focus:outline-none focus:border-indigo-500"
                    onBlur={(e) => handleChange("titulo", e.target.value)}
                  />
                ) : (
                  <h1 className="text-4xl font-extrabold text-white">{mesa.titulo}</h1>
                )}

                <p className="text-lg text-gray-300 mt-2">
                  Narrador:{" "}
                  <span className="text-indigo-400 font-semibold">{mesa.narrador.nome}</span>
                </p>

                {isEditing ? (
                  <input
                    type="text"
                    defaultValue={mesa.sistema}
                    className="mt-1 bg-transparent border-b border-gray-700 text-gray-300 focus:outline-none focus:border-indigo-500"
                    onBlur={(e) => handleChange("sistema", e.target.value)}
                  />
                ) : (
                  <p className="text-gray-400">{mesa.sistema}</p>
                )}
              </div>

              <div>{renderBotoes()}</div>

              <div className="mt-4">
                <label className="block text-gray-300 mb-2">Tags</label>
                {!isEditing ? (
                  <div className="flex flex-wrap gap-2">
                    {mesa.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 rounded-full bg-indigo-600 text-white text-sm"
                      >
                          {tag.nome}
                        </span>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {tagsMock.map((tag) => (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => {
                          setMesa((prev) =>
                            prev
                              ? {
                                ...prev,
                                tags: prev.tags.some((t) => t.id === tag.id)
                                  ? prev.tags.filter((t) => t.id !== tag.id)
                                  : [...prev.tags, tag],
                              }
                              : prev
                          );
                        }}
                        className={`px-3 py-1 rounded-full text-sm transition ${
                          mesa.tags.some((t) => t.id === tag.id)
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {tag.nome}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Resumo */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Resumo</h2>
            {isEditing ? (
              <textarea
                defaultValue={mesa.resumo}
                className="w-full h-32 p-4 rounded-lg bg-gray-800 text-gray-300 resize-none focus:outline-none focus:border focus:border-indigo-500"
                onBlur={(e) => handleChange("resumo", e.target.value)}
              />
            ) : (
              <textarea className="w-full h-32 p-4 rounded-lg bg-gray-800 text-gray-300 resize-none focus:outline-none focus:border focus:border-indigo-500" disabled value={mesa.resumo}/>
            )}
          </section>

          {/* Informações adicionais */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Info da mesa */}
            <div className="p-6 rounded-xl space-y-4 bg-gray-800">
              <h3 className="text-xl font-semibold text-white">Informações</h3>

              {/* Narrador */}
              <p className="text-gray-300">
                Narrador: <span className="text-indigo-400">{mesa.narrador.nome}</span>
              </p>

              <p className="text-gray-300">Sistema: {mesa.sistema}</p>

              {/* Tags */}
              {!isEditing ? (
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
              ) : (
                <div className="flex flex-wrap gap-2 mt-2">
                  {mesa.tags.map((tag) => (
                    <label
                      key={tag.id}
                      className={`px-3 py-1 rounded-full cursor-pointer text-sm ${
                        mesa.tags.some((t) => t.id === tag.id)
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={mesa.tags.some((t) => t.id === tag.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            handleChange("tags", [...mesa.tags, tag]);
                          } else {
                            handleChange(
                              "tags",
                              mesa.tags.filter((t) => t.id !== tag.id)
                            );
                          }
                        }}
                      />
                      {tag.nome}
                    </label>
                  ))}
                </div>
              )}

              {/* Local */}
              {!isEditing ? (
                <p className="text-gray-300">Local: {mesa.local}</p>
              ) : (
                <input
                  type="text"
                  defaultValue={mesa.local}
                  placeholder="Local da sessão"
                  className="w-full px-3 py-2 rounded-lg bg-gray-900 text-gray-300 focus:outline-none focus:border-indigo-500"
                  onBlur={(e) => handleChange("local", e.target.value)}
                />
              )}

              {/* Dia e hora */}
              {!isEditing ? (
                <p className="text-gray-300">
                  {mesa.horario?.dia} às {mesa.horario?.hora}
                </p>
              ) : (
                <div className="flex gap-4">
                  <select
                    defaultValue={mesa.horario?.dia}
                    className="px-3 py-2 rounded-lg bg-gray-900 text-gray-300 focus:outline-none focus:border-indigo-500"
                    onChange={(e) =>
                      handleChange("horario", {...mesa.horario, dia: e.target.value})
                    }
                  >
                    {diasSemana.map((dia) => (
                      <option key={dia} value={dia}>
                        {dia}
                      </option>
                    ))}
                  </select>
                  <input
                    type="time"
                    defaultValue={mesa.horario?.hora}
                    className="px-3 py-2 rounded-lg bg-gray-900 text-gray-300 focus:outline-none focus:border-indigo-500"
                    onChange={(e) =>
                      handleChange("horario", {...mesa.horario, hora: e.target.value})
                    }
                  />
                </div>
              )}
            </div>

            {/* Histórico */}
            <div className="p-6 rounded-xl bg-gray-800">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">
                  Histórico de Sessões
                </h3>

                {user?.id === mesa.narrador.id && (
                  <button
                    onClick={() => console.log("Adicionar nova sessão")}
                    className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500"
                  >
                    + Adicionar Sessão
                  </button>
                )}
              </div>
              <ul className="space-y-2">
                {mesa.historico.map((sessao) => (
                  <li key={sessao.id}>
                    <button className="w-full text-left p-3 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600">
                      <span className="font-medium">{sessao.titulo}</span>
                      <span className="block text-sm text-gray-400">{sessao.data}</span>
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
