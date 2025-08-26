"use client";

import Link from "next/link";
import Image from "next/image";
import {ApiTable} from "@/services/table";

export default function TableSearchCard({table}: { table: ApiTable }) {
  return (
    <Link href={`/table/${table.id}`} className={`block w-full group`}>
      <article
        className="w-full bg-gray-800 rounded-2xl shadow-lg overflow-hidden ring-1 ring-black/10 hover:ring-gray-500/40 transition">
        <div className="flex flex-col md:flex-row">
          {/* Imagem à esquerda */}
          <div className="relative md:basis-2/5 md:min-w-[260px] md:max-w-[360px]">
            <div className="p-2 md:p-2 h-full">
              <div className="relative rounded-xl overflow-hidden h-48 md:h-full">
                <Image
                  src={table.imagem ? `http://localhost:8080${table.imagem}` : "https://placehold.co/600x400"}
                  alt={table.titulo}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                />
              </div>
            </div>
          </div>

          {/* Conteúdo à direita */}
          <div className="flex-1 p-4 md:p-5 flex flex-col min-h-[220px]">
            {/* Título */}
            <h2 className="text-xl font-semibold text-white mb-1 truncate">
              {table.titulo}
            </h2>

            {/* Metadados */}
            <div className="text-sm text-gray-300/90 space-y-0.5 mb-3 inline-flex flex-wrap gap-2">
              <span className="text-gray-400 ">Narrador:</span> {table.narrador.nome}
              <span className="text-gray-400">Sistema:</span> {table.sistema}
              <span className="text-gray-400">{table.horario?.dia || "-"} às {table.horario?.hora || "-"}</span>
            </div>

            {/* Tags */}
            {table.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {table.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-0.5 text-xs bg-gray-700 text-white rounded-full"
                  >
              {tag.nome}
              </span>
                ))}

                {/* Exibe "..." se tiver mais do que 3 */}
                {table.tags.length > 3 && (
                  <span className="px-2 py-0.5 text-xs bg-gray-600 text-white rounded-full">
                +{table.tags.length - 3}
              </span>
                )}
              </div>
            )}

            {/* Resumo com rolagem interna */}
            <div className="mt-auto">
              <div className="max-h-24 overflow-y-auto pr-2 custom-scrollbar">
                <p className="text-sm leading-snug text-gray-200/90">
                  {table.resumo}
                </p>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}