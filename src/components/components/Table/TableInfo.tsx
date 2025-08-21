// components/TableInfo.tsx
"use client";

import {ApiTable, Horario} from "@/services/table";

const diasSemana = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];

interface TableInfoProps {
  mesa: ApiTable;
  isEditing: boolean;
  onChange: <K extends keyof ApiTable>(field: K, value: ApiTable[K]) => void;
}

export default function TableInfo({mesa, isEditing, onChange}: TableInfoProps) {
  const setHorario = (patch: Partial<NonNullable<Horario>>) => {
    const current = mesa.horario || {dia: diasSemana[0], hora: "20:00"};
    onChange("horario", {...current, ...patch} as any);
  };

  return (
    <section className="p-6 rounded-xl space-y-4 bg-gray-800 text-white">
      <h3 className="text-xl font-semibold">Informações</h3>

      <p className="text-gray-300">
        Narrador: <span className="text-indigo-400">{mesa.narrador?.nome}</span>
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

      {/* Local */}
      {!isEditing ? (
        <p className="text-gray-300">Local: {mesa.local || "-"}</p>
      ) : (
        <input
          type="text"
          defaultValue={mesa.local}
          placeholder="Local da sessão"
          className="w-full px-3 py-2 rounded-lg bg-gray-900 text-gray-300 focus:outline-none focus:border-indigo-500"
          onBlur={(e) => onChange("local", e.target.value as any)}
        />
      )}

      {/* Dia e hora */}
      {!isEditing ? (
        <p className="text-gray-300">
          {mesa.horario?.dia || "-"} às {mesa.horario?.hora || "-"}
        </p>
      ) : (
        <div className="flex gap-4">
          <select
            defaultValue={mesa.horario?.dia || diasSemana[0]}
            className="px-3 py-2 rounded-lg bg-gray-900 text-gray-300 focus:outline-none focus:border-indigo-500"
            onChange={(e) => setHorario({dia: e.target.value})}
          >
            {diasSemana.map((dia) => (
              <option key={dia} value={dia}>
                {dia}
              </option>
            ))}
          </select>
          <input
            type="time"
            defaultValue={mesa.horario?.hora || "20:00"}
            className="px-3 py-2 rounded-lg bg-gray-900 text-gray-300 focus:outline-none focus:border-indigo-500"
            onChange={(e) => setHorario({hora: e.target.value})}
          />
        </div>
      )}
    </section>
  );
}