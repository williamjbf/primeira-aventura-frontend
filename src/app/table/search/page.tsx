"use client";

import {useEffect, useState} from "react";
import Sidebar from "@/components/components/Sidebar/Sidebar";
import Topbar from "@/components/components/Topbar/Topbar";
import TableList from "@/components/components/Table/search/TableSearchList";
import {TableSearchFilters, Tag} from "@/services/table";
import {getAllTags} from "@/services/tag";
import TagSelector from "@/components/components/Tag/TagSelector";
import {useRouter, useSearchParams} from "next/navigation";

export default function SearchTablesPage() {
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showExtraFilters, setShowExtraFilters] = useState(false);
  const [allTags, setAllTags] = useState<Tag[]>([]);

  const query = searchParams.get("q") || "";
  const tagParams = searchParams.getAll("tag");

  const [filters, setFilters] = useState<TableSearchFilters>({
    titulo: "",
    sistema: "",
    tags: [],
    usuario: ""
  });

  useEffect(() => {
    if (query) {
      handleFilterChange("titulo", query);
      router.replace("/table/search");
    }
  }, [query]);

  useEffect(() => {
    if (tagParams.length > 0) {
      // só altera se for diferente
      setFilters((prev) => {
        const iguais = prev.tags.length === tagParams.length &&
          prev.tags.every((t) => tagParams.includes(t));
        if (iguais) return prev;
        return { ...prev, tags: tagParams };
      });
      router.replace("/table/search");
    }
  }, [tagParams]);

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

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleFilterChange = (field: keyof TableSearchFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTagsChange = (selectedTags: string[]) => {
    handleFilterChange("tags", selectedTags);
  };

  const clearFilters = () => {
    handleFilterChange("titulo", "");
    handleFilterChange("sistema", "");
    handleFilterChange("usuario", "");
    handleFilterChange("tags", []);
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar/>

      <main className="flex-1 overflow-y-auto ml-64 bg-gray-900 rounded-l-lg">
        {/* Topbar fixa */}
        <Topbar scrolled={scrolled}/>


        <div className="pt-32 px-6 max-w-7xl mx-auto space-y-10 pb-20">

          <div className="space-y-2">
            {/* Linha principal */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Pesquisar..."
                className="flex-1 px-4 py-2 rounded-xl border border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              />

              <button
                onClick={() => setShowExtraFilters((prev) => !prev)}
                className="px-4 py-2 rounded-xl bg-gray-600 text-white hover:bg-gray-700 transition"
              >
                Filtros
              </button>
            </div>

            {/* Filtros extras */}
            {showExtraFilters && (
              <div className="gap-2 inline-flex">
                <TagSelector
                  allTags={allTags}
                  filters={filters}
                  handleTagsChange={handleTagsChange}
                />
                <input
                  type="text"
                  placeholder="Sistema..."
                  className="px-4 py-2 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
                  value={filters.sistema}
                  onChange={(e) => handleFilterChange("sistema", e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Narrador..."
                  className="px-4 py-2 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-400"
                  value={filters.usuario}
                  onChange={(e) => handleFilterChange("usuario", e.target.value)}
                />
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white hover:bg-red-700 transition w-max"
                >
                  Limpar filtros
                </button>
              </div>
            )}
          </div>

          <div>

            <TableList filters={filters}/>

          </div>
        </div>
      </main>
    </div>
  );
}
