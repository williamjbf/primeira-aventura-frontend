"use client";

import {useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {useAuth} from "@/contexts/AuthContext";
import LoadingScreen from "@/components/components/loading/LoadingScreen";

export default function PostLoginPage() {
  const router = useRouter();
  const {refreshUser} = useAuth();

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        await refreshUser();
      } finally {
        if (isMounted) {
          router.replace(redirectTo);
        }
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [refreshUser, router, redirectTo]);

  return <LoadingScreen/>;
}
