"use client";

import Sidebar from "@/components/components/Sidebar/Sidebar";
import Topbar from "@/components/components/Topbar/Topbar";
import {useAuth} from "@/contexts/AuthContext";
import {useEffect, useState} from "react";
import {criarMesa} from "@/services/table";

interface Tag {
  id: number;
  nome: string;
}

export default function CreateTablePage() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  // Estado dos campos do formulário
  const [nome, setNome] = useState("");
  const [resumo, setResumo] = useState("");
  const [sistema, setSistema] = useState("");
  const [imagem, setImagem] = useState("https://placehold.co/600x400");
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  // Mock das tags (simula resposta futura da API)
  const [tags, setTags] = useState<Tag[]>([
    {id:1, nome:"Fantasia"},
    {id:2, nome:"Terror"},
    {id:3, nome:"Sci-Fi"},
    {id:4, nome:"Suspense"},
    {id:5, nome:"Aventura"},
    {id:6, nome:"Comédia"},
    {id:7, nome:"Mistério"},
    {id:8, nome:"Drama"},
    {id:9, nome:"Cyberpunk"},
    {id:10, nome:"Steampunk"}
  ]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Função de submit do formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Você precisa estar logado para criar uma mesa.");
      return;
    }

    try {
      const novaMesa = await criarMesa({
        nome,
        resumo,
        sistema,
        imagem,
        idNarrador: Number(user.id),
        idTags: selectedTags,
      });

      // Atualiza os estados com os dados retornados pela API
      setNome(novaMesa.titulo || "");
      setResumo(novaMesa.resumo || "");
      setSistema(novaMesa.sistema || "");
      setImagem(novaMesa.imagem || "https://placehold.co/600x400");
      setSelectedTags(novaMesa.tags?.map((t: any) => t.id) || []);

      alert("Mesa criada com sucesso!");
    } catch (error) {
      console.error("Erro ao criar mesa:", error);
      alert("Erro ao criar a mesa. Tente novamente.");
    }

  };

  // Função para marcar/desmarcar tags
  const toggleTag = (id: number) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />

      <main className="flex-1 overflow-y-auto ml-64 bg-gray-900 rounded-l-lg">

        <div className="relative h-[300px] w-full-64">
          <div
            className="absolute inset-0 bg-cover bg-top"
            style={{backgroundImage: "url('/banner.jpeg')"}}
          />

          {/* Overlay com gradient para sumir na cor da home */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-gray-900"/>
        </div>

        {/* Topbar fixa */}
        <Topbar scrolled={scrolled} />

        {/* Conteúdo central */}
        <div className="pt-16 px-6 max-w-7xl mx-auto space-y-10">
          <h1 className="text-3xl font-bold text-white">Criar Nova Mesa</h1>

          <form
            onSubmit={handleSubmit}
            className="bg-gray-800 p-6 rounded-2xl shadow-lg space-y-6"
          >
            {/* Nome */}
            <div>
              <label className="block text-gray-300">Nome da Mesa</label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full mt-1 p-2 rounded-lg bg-gray-700 text-white"
                required
              />
            </div>

            {/* Resumo */}
            <div>
              <label className="block text-gray-300">Resumo</label>
              <textarea
                value={resumo}
                onChange={(e) => setResumo(e.target.value)}
                className="w-full mt-1 p-2 rounded-lg bg-gray-700 text-white"
                rows={4}
                required
              />
            </div>

            {/* Sistema */}
            <div>
              <label className="block text-gray-300">Sistema</label>
              <input
                type="text"
                value={sistema}
                onChange={(e) => setSistema(e.target.value)}
                className="w-full mt-1 p-2 rounded-lg bg-gray-700 text-white"
                required
              />
            </div>

            {/* Imagem */}
            <div>
              <label className="block text-gray-300">Link da Imagem</label>
              <input
                type="url"
                value={imagem}
                onChange={(e) => setImagem(e.target.value)}
                className="w-full mt-1 p-2 rounded-lg bg-gray-700 text-white"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-gray-300">Tags</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <button
                    type="button"
                    key={tag.id}
                    onClick={() => toggleTag(tag.id)}
                    className={`px-4 py-1 rounded-full text-sm ${
                      selectedTags.includes(tag.id)
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-600 text-gray-300"
                    }`}
                  >
                    {tag.nome}
                  </button>
                ))}
              </div>
            </div>

            {/* Botão */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-500"
              >
                Criar Mesa
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}