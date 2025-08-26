"use client";


import {ApiTable, buscarTablesAvancado, TableSearchFilters} from "@/services/table";
import TableSearchCard from "@/components/components/Table/search/TableSearchCard";
import {useEffect, useState} from "react";


export default function TableList({ filters }: { filters: TableSearchFilters }) {

  const [mesas, setMesas] = useState<ApiTable[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        console.log(filters);

        const data = await buscarTablesAvancado(filters);
        if (!mounted) return;
        setMesas(data);
      } catch (err: any) {
        console.error("Erro ao buscar mesas:", err);
        setError(err?.general || err?.message || "Erro ao carregar mesas");
      }
    })();

    return () => {
      mounted = false;
    }
  }, [filters]);

  if (!error && (!mesas || mesas.length === 0)) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Nenhuma mesa encontrada...
      </div>
    )
  }

  return (
    <div className={`w-full grid grid-cols-12 gap-6`}>
      {mesas.map((m) => (
        <div key={m.id} className="col-span-12 lg:col-span-6">
          <TableSearchCard table={m}/>
        </div>
      ))}
    </div>
  );
}
