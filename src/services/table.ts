import { apiFetch } from "./api";

export interface ApiTable {
  id: string;
  imagem: string;
  titulo: string;
  resumo: string;
  sistema: string;
  mestreNome: string;
  tags: string[];
  createdAt: string;
}

export async function getRecentTables(): Promise<ApiTable[]> {
  return apiFetch<ApiTable[]>(`/tables/recentes`, {
    method: "GET",
  });
}

export interface TableSearchFilters {
  titulo?: string;
  sistema?: string;
  tags?: string[];
  usuario?: string;
}

export async function buscarTables(filtros: TableSearchFilters): Promise<ApiTable[]> {
  return apiFetch<ApiTable[]>(`/tables/buscar`, {
    method: "POST",
    body: JSON.stringify(filtros),
  });
}
