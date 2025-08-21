import {apiFetch, apiFormData} from "./api";

export interface ApiTable {
  id: string;
  imagem: any;
  titulo: string;
  resumo: string;
  sistema: string;
  narrador: Narrador;
  tags: Tag[];
  createdAt: string;
}

export interface Narrador {
  id: string;
  nome: string;
}

export interface CreateTableRequest {
  nome: string;
  resumo: string;
  sistema: string;
  imagem: string;
  idNarrador: number;
  idTags: number[];
}

export interface SaveTableRequest {
  id?: number;
  titulo: string;
  imagem: string;
  sistema: string;
  resumo: string;
  narradorId: number;
  tags: number[];
  local?: string;
  horario?: {
    dia: string;
    hora: string;
  };
}

export interface Tag {
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

export async function buscarMesaPorId(id: string): Promise<ApiTable> {
  return apiFetch<ApiTable>(`/tables/${id}`, {
    method: "GET",
    credentials: "include",
  });
}

export async function salvarMesa(formData: FormData) {
  return fetch("http://localhost:8080/api/tables/save", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
}