"use client";

interface TableHistoricoProps {
  historico: { id: number; titulo: string; data: string }[];
  isNarrador: boolean;
  onAdd?: () => void;
}

export default function TableHistorico({historico, isNarrador, onAdd}: TableHistoricoProps) {
  return (
    <section className="p-6 rounded-xl bg-gray-800 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Histórico de Sessões</h3>
        {isNarrador && (
          <button onClick={onAdd} className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-500">
            + Adicionar Sessão
          </button>
        )}
      </div>
      <ul className="space-y-2">
        {historico.map((sessao) => (
          <li key={sessao.id}>
            <button className="w-full text-left p-3 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600">
              <span className="font-medium">{sessao.titulo}</span>
              <span className="block text-sm text-gray-400">{sessao.data}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}