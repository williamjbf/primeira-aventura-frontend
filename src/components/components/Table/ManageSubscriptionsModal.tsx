"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  buscarInscricoes,
  atualizarMultiplasInscricoes,
  SubscriptionResponse,
  SubscriptionUser,
} from "@/services/table";

type StatusInscricao = "PENDENTE" | "ACEITO" | "RECUSADO";

type Item = {
  id: number;
  status: StatusInscricao;
  username: string;
};

type Props = {
  open: boolean;
  tableId: number | string;
  onClose: () => void;
  onSaved?: () => void; // chamado após salvar com sucesso
};

export default function ManageSubscriptionsModal({ open, tableId, onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [aceitos, setAceitos] = useState<Item[]>([]);
  const [pendentes, setPendentes] = useState<Item[]>([]);
  const [recusados, setRecusados] = useState<Item[]>([]);

  // Snapshot inicial para detectar mudanças
  const [initialMap, setInitialMap] = useState<Map<number, StatusInscricao>>(new Map());

  // Seleção e Drag
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [draggingId, setDraggingId] = useState<number | null>(null);

  const allItems = useMemo(() => [...aceitos, ...pendentes, ...recusados], [aceitos, pendentes, recusados]);

  useEffect(() => {
    if (!open || !tableId) return;

    const mapUser = (u: SubscriptionUser, status: StatusInscricao): Item => ({
      id: Number(u.id),
      status,
      username: u.username,
    });

    const load = async () => {
      setLoading(true);
      try {
        const data: SubscriptionResponse = await buscarInscricoes(tableId);
        const a = (data.accepted || []).map((u) => mapUser(u, "ACEITO"));
        const p = (data.pending || []).map((u) => mapUser(u, "PENDENTE"));
        const r = (data.denied || []).map((u) => mapUser(u, "RECUSADO"));

        setAceitos(a);
        setPendentes(p);
        setRecusados(r);
        setSelected(new Set());

        const init = new Map<number, StatusInscricao>();
        a.forEach((i) => init.set(i.id, "ACEITO"));
        p.forEach((i) => init.set(i.id, "PENDENTE"));
        r.forEach((i) => init.set(i.id, "RECUSADO"));
        setInitialMap(init);
      } catch (e) {
        console.error("Falha ao carregar inscrições:", e);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open, tableId]);

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const onDragStart = (id: number) => setDraggingId(id);

  const moveSelectedTo = (status: StatusInscricao) => {
    if (!selected.size) return;
    const selectedIds = new Set(selected);

    const removeFrom = (list: Item[]) => list.filter((i) => !selectedIds.has(i.id));
    const pickedFrom = (list: Item[]) => list.filter((i) => selectedIds.has(i.id)).map((i) => ({ ...i, status }));

    const nextAceitos = removeFrom(aceitos);
    const nextPendentes = removeFrom(pendentes);
    const nextRecusados = removeFrom(recusados);

    const moved: Item[] = [
      ...pickedFrom(aceitos),
      ...pickedFrom(pendentes),
      ...pickedFrom(recusados),
    ];

    if (status === "ACEITO") {
      setAceitos([...nextAceitos, ...moved]);
      setPendentes(nextPendentes);
      setRecusados(nextRecusados);
    } else if (status === "PENDENTE") {
      setAceitos(nextAceitos);
      setPendentes([...nextPendentes, ...moved]);
      setRecusados(nextRecusados);
    } else {
      setAceitos(nextAceitos);
      setPendentes(nextPendentes);
      setRecusados([...nextRecusados, ...moved]);
    }

    setSelected(new Set());
  };

  const onDropTo = (status: StatusInscricao) => {
    if (draggingId == null) return;
    setSelected(new Set([draggingId]));
    moveSelectedTo(status);
    setDraggingId(null);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Detecta mudanças comparando com o snapshot inicial
      const changed: Array<{ id: number; status: StatusInscricao }> = [];
      for (const i of allItems) {
        const original = initialMap.get(i.id);
        if (original && original !== i.status) {
          changed.push({ id: i.id, status: i.status });
        }
      }

      if (changed.length) {
        // Agrupa por status para usar a API { id: number[], status: "..." }
        const group: Record<StatusInscricao, number[]> = {
          ACEITO: [],
          PENDENTE: [],
          RECUSADO: [],
        };
        changed.forEach((c) => group[c.status].push(c.id));

        const calls: Promise<any>[] = [];
        if (group.ACEITO.length) {
          calls.push(
            atualizarMultiplasInscricoes({ ids: group.ACEITO, status: "ACEITO" })
          );
        }
        if (group.PENDENTE.length) {
          calls.push(
            atualizarMultiplasInscricoes({ ids: group.PENDENTE, status: "PENDENTE" })
          );
        }
        if (group.RECUSADO.length) {
          calls.push(
            atualizarMultiplasInscricoes({ ids: group.RECUSADO, status: "RECUSADO" })
          );
        }
        await Promise.all(calls);
      }

      onSaved?.();
      onClose();
    } catch (e) {
      console.error("Falha ao salvar alterações de inscrições:", e);
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" onClick={() => !saving && onClose()} />
      <div className="relative bg-gray-800 text-white rounded-xl shadow-xl w-[95vw] max-w-6xl max-h-[85vh] overflow-hidden border border-gray-700">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">
          <h3 className="text-lg font-semibold">Gerenciar inscrições</h3>
          <button
            className="text-gray-300 hover:text-white"
            onClick={() => !saving && onClose()}
            disabled={saving}
          >
            Fechar
          </button>
        </div>

        <div className="p-5">
          {loading ? (
            <div className="py-8 text-center text-gray-300">Carregando inscrições...</div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {/* PENDENTES */}
              <div
                className="bg-gray-900 rounded-lg border border-gray-700 p-3"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDropTo("PENDENTE")}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-yellow-300">Pendentes</h4>
                  <button
                    className="text-xs px-2 py-1 bg-indigo-700 rounded hover:bg-indigo-600"
                    onClick={() => moveSelectedTo("PENDENTE")}
                    disabled={saving}
                  >
                    Mover selecionados
                  </button>
                </div>
                <ul className="space-y-2 min-h-[220px]">
                  {pendentes.map((i) => {
                    const isSel = selected.has(i.id);
                    return (
                      <li
                        key={i.id}
                        draggable
                        onDragStart={() => onDragStart(i.id)}
                        onClick={() => toggleSelect(i.id)}
                        className={`px-3 py-2 rounded border cursor-move select-none ${
                          isSel ? "bg-yellow-900/40 border-yellow-600" : "bg-gray-800 border-gray-700"
                        }`}
                      >
                        {i.username}
                      </li>
                    );
                  })}
                  {!pendentes.length && <li className="text-sm text-gray-500">Nenhum pendente</li>}
                </ul>
              </div>

              {/* ACEITOS */}
              <div
                className="bg-gray-900 rounded-lg border border-gray-700 p-3"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDropTo("ACEITO")}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-green-300">Aceitos</h4>
                  <button
                    className="text-xs px-2 py-1 bg-indigo-700 rounded hover:bg-indigo-600"
                    onClick={() => moveSelectedTo("ACEITO")}
                    disabled={saving}
                  >
                    Mover selecionados
                  </button>
                </div>
                <ul className="space-y-2 min-h-[220px]">
                  {aceitos.map((i) => {
                    const isSel = selected.has(i.id);
                    return (
                      <li
                        key={i.id}
                        draggable
                        onDragStart={() => onDragStart(i.id)}
                        onClick={() => toggleSelect(i.id)}
                        className={`px-3 py-2 rounded border cursor-move select-none ${
                          isSel ? "bg-green-900/30 border-green-600" : "bg-gray-800 border-gray-700"
                        }`}
                      >
                        {i.username}
                      </li>
                    );
                  })}
                  {!aceitos.length && <li className="text-sm text-gray-500">Nenhum aceito</li>}
                </ul>
              </div>

              {/* RECUSADOS */}
              <div
                className="bg-gray-900 rounded-lg border border-gray-700 p-3"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDropTo("RECUSADO")}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-red-300">Negados</h4>
                  <button
                    className="text-xs px-2 py-1 bg-indigo-700 rounded hover:bg-indigo-600"
                    onClick={() => moveSelectedTo("RECUSADO")}
                    disabled={saving}
                  >
                    Mover selecionados
                  </button>
                </div>
                <ul className="space-y-2 min-h-[220px]">
                  {recusados.map((i) => {
                    const isSel = selected.has(i.id);
                    return (
                      <li
                        key={i.id}
                        draggable
                        onDragStart={() => onDragStart(i.id)}
                        onClick={() => toggleSelect(i.id)}
                        className={`px-3 py-2 rounded border cursor-move select-none ${
                          isSel ? "bg-red-900/30 border-red-600" : "bg-gray-800 border-gray-700"
                        }`}
                      >
                        {i.username}
                      </li>
                    );
                  })}
                  {!recusados.length && <li className="text-sm text-gray-500">Nenhum negado</li>}
                </ul>
              </div>
            </div>
          )}

          {/* Rodapé */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2 text-xs">
              <span className="text-gray-400">Dica: você pode</span>
              <span className="px-2 py-0.5 rounded bg-gray-700 text-gray-200">clicar</span>
              <span className="text-gray-400">para selecionar,</span>
              <span className="px-2 py-0.5 rounded bg-gray-700 text-gray-200">arrastar</span>
              <span className="text-gray-400">para mover, ou usar os botões “Mover selecionados”.</span>
            </div>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-60"
                onClick={onClose}
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60"
                onClick={handleSave}
                disabled={saving || loading}
              >
                {saving ? "Salvando..." : "Salvar alterações"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
