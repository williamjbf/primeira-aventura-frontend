"use client";

import {useAuth} from "@/contexts/AuthContext";
import {useRouter} from "next/navigation";

export default function CreateAdventureSection() {

  const { user, loading } = useAuth();
  const router = useRouter();

  const handleCreateAdventure = () => {
    if (!user) {
      router.push("/login"); // redireciona para login
    } else {
      router.push("/create-adventure"); // vai para criar mesa
    }
  };

  return (
    <section className="mt-8 rounded-xl bg-gradient-to-r from-blue-400 via-blue-600 to-blue-800 p-8 shadow-lg text-center">
      <h2 className="text-2xl md:text-3xl font-bold text-white">
        Crie sua própria aventura!
      </h2>
      <p className="mt-2 text-gray-100 text-lg">
        Reúna seus amigos, escolha um sistema e dê vida às suas histórias.
      </p>
      <button
        onClick={handleCreateAdventure}
        className="mt-4 px-6 py-3 rounded-lg bg-gray-100 text-gray-900 font-semibold hover:bg-gray-300 transition-colors"
        disabled={loading}
      >
        Criar Mesa
      </button>
    </section>
  );
}