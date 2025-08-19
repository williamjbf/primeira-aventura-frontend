import { apiFetch } from "./api";

export interface ApiTable {
  id: string;
  imagem: string;
  titulo: string;
  resumo: string;
  sistema: string;
  narrador: string;
  tags: tag[];
  createdAt: string;
}

export interface CreateTableRequest {
  nome: string;
  resumo: string;
  sistema: string;
  imagem: string;
  idNarrador: number;
  idTags: number[];
}

export interface tag{
  id: number;
  nome: string;
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
    credentials: "include",
  });
}

export async function criarMesa(data: CreateTableRequest): Promise<ApiTable> {
  return apiFetch<ApiTable>("/tables", {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
  });
}
