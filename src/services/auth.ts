import { apiFetch } from "./api";


interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  // outros campos que seu backend retornar
}

interface RegisterResponse {
  token: string; // ou qualquer resposta que seu backend retorne
}

interface TableList {
  id: string,
  titulo: string
}

interface User {
  id: string;
  username: string;
  email: string;
  subscriptions: {
    acceptedList: TableList[],
    pendingList: TableList[],
    deniedList: TableList[]
  },
  ownedTables: TableList[]
}

export async function login(data: LoginData): Promise<LoginResponse> {
  return apiFetch<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
  });
}

export async function logout(): Promise<void> {
  return apiFetch<void>("/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export async function register(data: RegisterData): Promise<RegisterResponse> {
  return apiFetch<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
  });
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await apiFetch<User>("/auth/user", {
      method: "GET",
      credentials: "include",
    });
    console.log("User:", user);
    return user;
  } catch (error: any) {
    return null; // se der erro, considera que não está logado
  }
}

