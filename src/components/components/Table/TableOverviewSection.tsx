// components/TableOverviewSection.tsx
"use client";
import {useCallback} from "react";
import Image from "next/image";
import {ApiTable, Tag} from "@/services/table";

interface TableOverviewSectionProps {
  mesa: ApiTable;
  isEditing: boolean;
  availableTags: Tag[];
  renderActions?: React.ReactNode; // exibe botões Salvar/Editar etc
  onChange: <K extends keyof ApiTable>(field: K, value: ApiTable[K]) => void;
}

export default function TableOverviewSection({
                                               mesa,
                                               isEditing,
                                               availableTags,
                                               renderActions,
                                               onChange,
                                             }: TableOverviewSectionProps) {
  const imageSrc = mesa.previewUrl || `http://localhost:8080${mesa.imagem}`;

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const url = URL.createObjectURL(file);
      onChange("imagem", file);
      onChange("previewUrl", url as any);
    },
    [onChange]
  );

  const toggleTag = (tag: Tag) => {
    const selected = mesa.tags.some((t) => t.id === tag.id);
    const newTags = selected
      ? mesa.tags.filter((t) => t.id !== tag.id)
      : [...mesa.tags, tag];
    onChange("tags", newTags as any);
  };

  return (
    <section className="flex gap-8">
      {/* Imagem */}
      <div className="flex flex-col gap-2">
        <div className="relative w-64 h-64">
          <Image
            src={imageSrc}
            alt={mesa.titulo}
            fill
            className="rounded-xl shadow-lg object-cover"
            unoptimized
          />
        </div>
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            className="text-gray-300 text-sm"
            onChange={handleFileChange}
          />
        )}
      </div>

      {/* Info principal */}
      <div className="flex-1 flex flex-col justify-between space-y-4">
        <div>
          {isEditing ? (
            <input
              type="text"
              value={mesa.titulo}
              className="text-4xl font-extrabold bg-transparent border-b border-gray-700 text-white tracking-tight drop-shadow-md focus:outline-none focus:border-indigo-500"
              onChange={(e) => onChange("titulo", e.target.value as any)}
            />
          ) : (
            <h1 className="text-4xl font-extrabold text-white">{mesa.titulo}</h1>
          )}

          <p className="text-lg text-gray-300 mt-2">
            Narrador:{" "}
            <span className="text-indigo-400 font-semibold">
              {mesa.narrador?.nome}
            </span>
          </p>

          {isEditing ? (
            <input
              type="text"
              value={mesa.sistema}
              className="mt-1 bg-transparent border-b border-gray-700 text-gray-300 focus:outline-none focus:border-indigo-500"
              onChange={(e) => onChange("sistema", e.target.value as any)}
            />
          ) : (
            <p className="text-gray-400">{mesa.sistema}</p>
          )}
        </div>

        <div>{renderActions}</div>

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
              {availableTags.map((tag) => {
                const selected = mesa.tags.some((t) => t.id === tag.id);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition ${
                      selected
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {tag.nome}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}