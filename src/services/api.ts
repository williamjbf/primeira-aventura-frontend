const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    credentials: "include",
    ...options,
  });

  let data: any;
  try {
    data = await res.json();
  } catch {
    // Se não conseguir fazer parse, dispara erro genérico
    if (!res.ok) throw { general: "Erro na requisição" };
    return {} as T;
  }

  if (!res.ok) {
    // Se vier no formato novo com "mensagem" como objeto de erros
    if (data && typeof data.mensagem === "object") {
      throw data.mensagem; // objeto {campo: mensagem}
    }
    // Caso contrário, tenta erro simples
    throw { general: data.message || "Erro na requisição" };
  }

  return data as T;
}
