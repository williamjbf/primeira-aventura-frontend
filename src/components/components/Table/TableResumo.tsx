// components/TableResumo.tsx
"use client";

interface TableResumoProps {
  resumo: string;
  isEditing: boolean;
  onChange: (value: string) => void;
}

export default function TableResumo({resumo, isEditing, onChange}: TableResumoProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-white mb-4">Resumo</h2>
      {isEditing ? (
        <textarea
          defaultValue={resumo}
          className="w-full h-32 p-4 rounded-lg bg-gray-800 text-gray-300 resize-none focus:outline-none focus:border focus:border-indigo-500"
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <textarea
          className="w-full h-32 p-4 rounded-lg bg-gray-800 text-gray-300 resize-none"
          value={resumo}
          disabled
        />
      )}
    </section>
  );
}