"use client";

import {useEffect, useState} from "react";
import {ApiTable, buscarTables} from "@/services/table";
import {TableCarousel} from "@/components/components/Table/TableCarousel";
import Link from "next/link";
import {BiChevronRight} from "react-icons/bi";

interface TaggedCarouselSectionProps {
  tag: string;
}

export default function TaggedCarouselSection({tag}: TaggedCarouselSectionProps) {
  const [mesas, setMesas] = useState<ApiTable[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await buscarTables({
          titulo: "",
          sistema: "",
          tags: [tag],
          usuario: "",
        });
        if (!mounted) return;
        setMesas(data);
      } catch (err: any) {
        console.error(`Erro ao buscar mesas de ${tag}:`, err);
        setError(err?.general || err?.message || `Erro ao carregar mesas de ${tag}`);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [tag]);

  if (!error && (!mesas || mesas.length === 0)) {
    return null;
  }

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-extrabold text-white tracking-wide">
          Mesas de {tag}
        </h2>
        <Link
          href={`/table/search?tag=${encodeURIComponent(tag)}`}
          className="flex items-center gap-1 text-sm text-gray-300 hover:text-white transition-colors"
        >
          Ver mais <BiChevronRight size={18}/>
        </Link>
      </div>
      {error && <p className="text-red-400">{error}</p>}
      {!error && <TableCarousel tables={mesas}/>}
      <div className="pb-4 pt-4 border-b border-gray-700/"></div>
    </section>
  );
}
