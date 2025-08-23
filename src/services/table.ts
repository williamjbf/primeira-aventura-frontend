import {apiFetch} from "./api";

export interface ApiTable {
  id: string | number;
  titulo: string;
  sistema: string;
  resumo: string;
  imagem: string | File;
  previewUrl?: string;
  local?: string;
  horario?: Horario;
  narrador: Narrador;
  tags: Tag[];
  createdAt: string;
}

export interface RecentsTables {
  id: string | number;
  imagem: string | File;
  titulo: string;
  sistema: string;
  mestreNome: string;
  createdAt: string;
}

export interface Horario {
  dia: string;
  hora: string
}

export interface Tag {
  id: number;
  nome: string;
}

export interface Narrador {
  id: string;
  nome: string;
}

export interface TableSearchFilters {
  titulo?: string;
  sistema?: string;
  tags?: string[];
  usuario?: string;
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

export interface TableList {
  id: string,
  titulo: string
}

export interface SubscribeRequest {
  tableId: number;
  userId: number;
}

export interface SubscribeResponse {
  "id": string | number,
  "userId": string | number,
  "tableId": string | number,
  "status": string
}

export interface SubscriptionUser {
  id: number;
  userId: number;
  username: string;
}

export interface SubscriptionResponse {
  accepted: SubscriptionUser[];
  denied: SubscriptionUser[];
  pending: SubscriptionUser[];
}

export interface SubscribeBulkUpdateRequest {
  "ids": string[] | number[],
  "status": string
}

function parseHorario(input: unknown): Horario | undefined {
  if (input == null) return undefined;

  let value: any = input;
  if (typeof input === "string") {
    try {
      value = JSON.parse(input);
    } catch {
      return undefined;
    }
  }
  if (
    value &&
    typeof value === "object" &&
    typeof value.dia === "string" &&
    typeof value.hora === "string"
  ) {
    return {dia: value.dia, hora: value.hora};
  }
  return undefined;
}

function normalizeApiTable<T extends { horario?: unknown }>(t: T): T & { horario?: Horario } {
  return {...t, horario: parseHorario(t.horario)};
}

export async function getRecentTables(): Promise<RecentsTables[]> {
  return apiFetch<RecentsTables[]>(`/tables/recentes`, {
    method: "GET",
  });
}

export async function buscarTables(filtros: TableSearchFilters): Promise<ApiTable[]> {
  const response = await apiFetch<ApiTable[]>(`/tables/buscar`, {
    method: "POST",
    body: JSON.stringify(filtros),
    credentials: "include",
  });
  return response.map((t) => normalizeApiTable(t));
}

export async function buscarMesaPorId(id: string): Promise<ApiTable> {
  const response = await apiFetch<ApiTable>(`/tables/${id}`, {
    method: "GET",
    credentials: "include",
  });
  return normalizeApiTable(response);
}

export async function buscarMesasDoDono(idUsuario: string | number): Promise<TableList[]> {
  return apiFetch<TableList[]>(`/tables/owner/${idUsuario}`, {
    method: "GET",
    credentials: "include",
  });
}

export async function buscarMesasInscritas(idUsuario: string | number): Promise<TableList[]> {
  return apiFetch<TableList[]>(`/tables/participate/${idUsuario}`, {
    method: "GET",
    credentials: "include",
  });
}

export async function buscarMesasPendentes(idUsuario: string | number): Promise<TableList[]> {
  return apiFetch<TableList[]>(`/tables/pending/${idUsuario}`, {
    method: "GET",
    credentials: "include",
  });
}

export async function buscarMesasNegadas(idUsuario: string | number): Promise<TableList[]> {
  return apiFetch<TableList[]>(`/tables/denied/${idUsuario}`, {
    method: "GET",
    credentials: "include",
  });
}

export async function inscreverMesa(data: SubscribeRequest): Promise<SubscribeResponse> {
  return apiFetch<SubscribeResponse>(`/tables/subscribe`, {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
  })
}

export async function buscarInscricoes(idMesa: string | number): Promise<SubscriptionResponse> {
  return apiFetch<SubscriptionResponse>(`/tables/${idMesa}/subscriptions`, {
    method: "GET",
    credentials: "include",
    }
  )
}

export async function atualizarMultiplasInscricoes(data: SubscribeBulkUpdateRequest): Promise<SubscribeResponse[]> {
  return apiFetch<SubscribeResponse[]>(`/tables/subscribe/status/batch`, {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
  })
}

export async function salvarMesa(formData: FormData): Promise<ApiTable> {
  const res = await fetch("http://localhost:8080/api/tables/save", {
    method: "POST",
    body: formData,
    credentials: "include",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `Falha ao salvar mesa (${res.status})`);
  }
  const data = await res.json();
  return normalizeApiTable(data);
}