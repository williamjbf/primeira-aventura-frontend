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
