"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import LoadingScreen from "@/components/components/loading/LoadingScreen";

export default function PostLoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        await refreshUser();
      } finally {
        if (isMounted) {
          router.replace("/");
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [refreshUser, router]);

  return <LoadingScreen />;
}
