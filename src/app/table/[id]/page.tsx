"use client";

import Sidebar from "@/components/components/Sidebar/Sidebar";
import Topbar from "@/components/components/Topbar/Topbar";
import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {ApiTable, buscarMesaPorId, inscreverMesa, salvarMesa} from "@/services/table";
import {useAuth} from "@/contexts/AuthContext";
import TableOverviewSection from "@/components/components/Table/TableOverviewSection";
import TableResumo from "@/components/components/Table/TableResumo";
import TableHero from "@/components/components/Table/TableHero ";
import TableInfo from "@/components/components/Table/TableInfo";
import TableHistorico from "@/components/components/Table/TableHistorico";
import ManageSubscriptionsModal from "@/components/components/Table/ManageSubscriptionsModal";

interface MesaDetalhes extends ApiTable {
  historico: { id: number; titulo: string; data: string }[];
  previewUrl?: string;
}

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
  const {user, refreshUser, loading: loadingUser} = useAuth();
  const {id} = useParams<{ id: string }>();
  const [subscribing, setSubscribing] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);

  useEffect(() => {
    const fetchMesa = async () => {
      try {
        const data = await buscarMesaPorId(id);

        const mesaComHistorico: MesaDetalhes = {
          ...data,
          historico: [
            {id: 1, titulo: "Sessão 1: Chegada à Baróvia", data: "10/08/2025"},
            {id: 2, titulo: "Sessão 2: A Taverna da Aldeia", data: "17/08/2025"},
          ]
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
      }

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

  const handleSubscribe = async () => {
    if (!user?.id || !mesa?.id) return;
    try {
      setSubscribing(true);
      await inscreverMesa({
        tableId: Number(mesa.id),
        userId: Number(user.id),
      });
      await refreshUser(); // atualiza user com listas novas
    } catch (e) {
      console.error("Erro ao inscrever na mesa:", e);
    } finally {
      setSubscribing(false);
    }
  };

  if (!mesa) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Carregando mesa...
      </div>
    );
  }

  // Estados do botão com base nas listas globais
  const mesaIdStr = String(mesa.id);
  const estaPendente = user?.subscriptions.pendingList.some((m) => String(m.id) === mesaIdStr);
  const estaInscrito = user?.subscriptions.acceptedList.some((m) => String(m.id) === mesaIdStr);
  const estaNegado = user?.subscriptions.deniedList.some((m) => String(m.id) === mesaIdStr);

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
        <div className="flex gap-3">
          <button
            onClick={() => setIsEditing(true)}
            className="px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500"
          >
            Editar
          </button>
          <button
            onClick={() => setManageOpen(true)}
            className="px-6 py-2 bg-indigo-700 rounded-lg text-white hover:bg-indigo-600"
          >
            Gerenciar inscrições
          </button>
        </div>
      );
    }
    const disabled = subscribing || loadingUser || estaPendente || estaInscrito || estaNegado;

    const label = subscribing
      ? "Enviando inscrição..."
      : loadingUser
        ? "Carregando..."
        : estaInscrito
          ? "Já inscrito"
          : estaPendente
            ? "Inscrição pendente"
            : estaNegado
              ? "Inscrição negada"
              : "Inscrever-se";

    return (
      <button
        onClick={handleSubscribe}
        disabled={disabled}
        className={`px-6 py-2 rounded-lg text-white ${
          disabled ? "bg-indigo-600/60 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-500"
        }`}
      >
        {label}
      </button>

    );
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar/>

      <main className="flex-1 overflow-y-auto ml-64 bg-gray-900 rounded-l-lg pb-10">
        {/* Hero */}
        <TableHero imageUrl={mesa.previewUrl || `http://localhost:8080${mesa.imagem}`}/>

        {/* Topbar fixa */}
        <Topbar scrolled={scrolled}/>

        {/* Conteúdo sobrepondo hero */}
        <div className="relative z-10 -mt-32 px-6 max-w-7xl mx-auto space-y-10">
          <TableOverviewSection
            mesa={mesa as any}
            isEditing={isEditing}
            availableTags={tagsMock}
            renderActions={renderBotoes()}
            onChange={handleChange as any}
          />

          <TableResumo resumo={mesa.resumo} isEditing={isEditing}
                       onChange={(val) => handleChange("resumo", val as any)}/>

          {/* Informações adicionais */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* Info da mesa */}
            <TableInfo mesa={mesa} isEditing={isEditing} onChange={handleChange as any}/>

            {/* Histórico */}
            <TableHistorico historico={mesa.historico} isNarrador={user?.id === mesa.narrador.id}/>
          </section>
        </div>
      </main>

      {/* Modal centralizada no novo componente */}
      {user?.id === mesa.narrador.id && (
        <ManageSubscriptionsModal
          open={manageOpen}
          tableId={mesa.id}
          onClose={() => setManageOpen(false)}
          onSaved={async () => {
            // Atualiza contexto/global após salvar
            try {
              await refreshUser();
            } catch (e) {
              console.error("Falha ao atualizar listas do usuário após salvar inscrições:", e);
            }
          }}
        />
      )}
    </div>
  );
}
