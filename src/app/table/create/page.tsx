"use client";

"use client";

import Sidebar from "@/components/components/Sidebar/Sidebar";
import Topbar from "@/components/components/Topbar/Topbar";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { salvarMesa } from "@/services/table";
import TableHero from "@/components/components/Table/TableHero ";
import TableOverviewSection from "@/components/components/Table/TableOverviewSection";
import TableResumo from "@/components/components/Table/TableResumo";
import TableInfo from "@/components/components/Table/TableInfo";
import {Router} from "next/router";
import {useRouter} from "next/navigation";
import {getAllTags} from "@/services/tag";
type Tag = { id: number; nome: string };
type Narrador = { id: string; nome: string };

interface MesaCadastro {
  id?: string | number;
  titulo: string;
  sistema: string;
  resumo: string;
  imagem: string | File;
  previewUrl?: string;
  local?: string;
  horario?: { dia: string; hora: string };
  narrador: Narrador;
  tags: Tag[];
  historico: { id: number; titulo: string; data: string }[];
}

const allTags: Tag[] = [
  { id: 1, nome: "Fantasia" },
  { id: 2, nome: "Terror" },
  { id: 3, nome: "Sci-Fi" },
  { id: 4, nome: "Suspense" },
  { id: 5, nome: "Aventura" },
  { id: 6, nome: "Comédia" },
  { id: 7, nome: "Mistério" },
  { id: 8, nome: "Drama" },
  { id: 9, nome: "Cyberpunk" },
  { id: 10, nome: "Steampunk" },
];

export default function TableCreatePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [mesa, setMesa] = useState<MesaCadastro>(() => ({
    titulo: "",
    sistema: "",
    resumo: "",
    // Imagem padrão local do projeto
    imagem: "",
    previewUrl: "/default.jpg",
    local: "",
    horario: { dia: "Sábado", hora: "20:00" },
    narrador: {
      id: (user?.id as string) || "",
      nome: user?.username ?? "",
    },
    tags: [],
    historico: [],
  }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const tags = await getAllTags();
        setAllTags(tags);
      } catch (err) {
        console.error("Erro ao carregar tags:", err);
      }
    })();
  }, []);

  // Garante que, se o usuário logar depois, atualizamos o narrador
  useEffect(() => {
    if (user?.id) {
      setMesa((prev) => ({
        ...prev,
        narrador: { id: user.id as string, nome: user.username ?? "" },
      }));
    }
  }, [user?.id, user?.username]);

  const handleChange = <K extends keyof MesaCadastro>(field: K, value: MesaCadastro[K]) => {
    setMesa((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    (document.activeElement as HTMLElement | null)?.blur();

    setLoading(true);
    try {
      const formData = new FormData();
      if (mesa.titulo) formData.append("titulo", mesa.titulo);
      if (mesa.sistema) formData.append("sistema", mesa.sistema);
      if (mesa.resumo) formData.append("resumo", mesa.resumo);
      if (mesa.local) formData.append("local", mesa.local);
      if (mesa.horario) formData.append("horario", JSON.stringify(mesa.horario));

      // narradorId obrigatório (converter para número, se necessário pelo backend)
      if (mesa.narrador?.id) {
        formData.append("narradorId", String(Number(mesa.narrador.id)));
      }

      // tags
      formData.append("tags", JSON.stringify(mesa.tags.map((t) => t.id)));

      // imagem apenas se for um File (o default.png é string e não deve ser enviado)
      if (mesa.imagem instanceof File) {
        formData.append("imagem", mesa.imagem);
      }

      const response = await salvarMesa(formData);
      if(response){
        router.push(`/table/${response.id}`);
      }
      alert("Mesa criada com sucesso!");
      // Você pode redirecionar aqui se desejar
    } catch (err) {
      console.error("Erro ao salvar mesa:", err);
      alert("Erro ao salvar a mesa. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // Render de ações: somente "Salvar"
  const renderActions = useMemo(
    () => (
      <button
        onClick={handleSave}
        disabled={loading}
        className="px-6 py-2 bg-green-600 rounded-lg text-white hover:bg-green-500 disabled:opacity-60"
      >
        {loading ? "Salvando..." : "Salvar"}
      </button>
    ),
    [loading, mesa]
  );

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />

      <main className="flex-1 overflow-y-auto ml-64 bg-gray-900 rounded-l-lg pb-10">
        {/* Hero com imagem padrão ou preview */}
        <TableHero imageUrl={mesa.previewUrl || `http://localhost:8080${mesa.imagem}`} />

        {/* Topbar fixa */}
        <Topbar scrolled={scrolled} />

        {/* Conteúdo sobrepondo hero */}
        <div className="relative z-10 -mt-32 px-6 max-w-7xl mx-auto space-y-10">
          {/* Seção de overview (imagem, título, sistema, tags, ação) */}
          <TableOverviewSection
            mesa={mesa as any}
            isEditing={true}
            availableTags={allTags}
            renderActions={renderActions}
            onChange={handleChange as any}
            // Para imagem local, não precisamos de imageBaseUrl
          />

          {/* Resumo (sempre editável) */}
          <TableResumo
            resumo={mesa.resumo}
            isEditing={true}
            onChange={(val) => handleChange("resumo", val)}
          />

          {/* Informações adicionais (sempre editáveis) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <TableInfo mesa={mesa as any} isEditing={true} onChange={handleChange as any} />
            {/* Mantemos o espaço do layout; você pode substituir por um card de “Dicas” ou “Políticas da Mesa” */}
            <div className="p-6 rounded-xl bg-gray-800 text-gray-300">
              <h3 className="text-xl font-semibold text-white mb-2">Dicas</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Defina um título claro e que reflita o estilo da mesa.</li>
                <li>Use o resumo para explicar o tom, a periodicidade e as ferramentas usadas.</li>
                <li>Selecione tags relevantes para facilitar a busca por jogadores.</li>
                <li>Escolha uma imagem que represente bem sua proposta; você pode alterar depois.</li>
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}