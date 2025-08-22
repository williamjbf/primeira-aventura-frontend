"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {ApiTable, buscarMesasDoDono, buscarMesasInscritas, buscarMesasPendentes, TableList} from "@/services/table";
import { useAuth } from "@/contexts/AuthContext";

type UserTablesContextType = {
  mesasProprias: ApiTable[];
  mesasInscritas: ApiTable[];
  mesasPendentes: ApiTable[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  clear: () => void;
};

const UserTablesContext = createContext<UserTablesContextType | undefined>(undefined);

export function UserTablesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth() as { user: { id?: string | number } | null };
  const [mesasProprias, setMesasProprias] = useState<TableList[]>([]);
  const [mesasInscritas, setMesasInscritas] = useState<TableList[]>([]);
  const [mesasPendentes, setMesasPendentes] = useState<TableList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clear = useCallback(() => {
    setMesasProprias([]);
    setMesasInscritas([]);
    setMesasPendentes([]);
    setError(null);
  }, []);

  const refresh = useCallback(async () => {
    if (!user?.id) {
      clear();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [proprias, inscritas, pendentes] = await Promise.all([
        buscarMesasDoDono(user.id),
        buscarMesasInscritas(user.id),
        buscarMesasPendentes(user.id)
      ]);
      setMesasProprias(proprias);
      setMesasInscritas(inscritas);
      setMesasPendentes(pendentes);
    } catch (e: any) {
      setError(e?.message || "Falha ao carregar mesas do usuário");
    } finally {
      setLoading(false);
    }
  }, [user?.id, clear]);

  // Carrega quando o usuário autenticar mude
  useEffect(() => {
    if (user?.id) {
      refresh();
    } else {
      clear();
    }
  }, [user?.id, refresh, clear]);

  const value = useMemo(
    () => ({ mesasProprias, mesasInscritas, mesasPendentes, loading, error, refresh, clear }),
    [mesasProprias, mesasInscritas, mesasPendentes, loading, error, refresh, clear]
  );

  return <UserTablesContext.Provider value={value}>{children}</UserTablesContext.Provider>;
}

export function useUserTables() {
  const ctx = useContext(UserTablesContext);
  if (!ctx) {
    throw new Error("useUserTables deve ser usado dentro de <UserTablesProvider>");
  }
  return ctx;
}