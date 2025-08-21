"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/components/loading/LoadingScreen";

export default function PostLoginPage() {
  const router = useRouter();
  const { user, fetchUser } = useAuth() as {
    user: { id?: string } | null;
    fetchUser?: () => Promise<void>;
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        // Se o contexto tiver um método para recarregar o usuário, chame aqui
        if (fetchUser) await fetchUser();
      } finally {
        if (!isMounted) return;
        // Decida o destino após carregar (ex.: /dashboard)
        router.replace("/");
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [fetchUser, router]);

  return <LoadingScreen />;
}
