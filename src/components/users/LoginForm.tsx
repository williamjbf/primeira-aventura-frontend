"use client";

import { useState } from "react";
import { login } from "@/services/auth";
import {useRouter, useSearchParams} from "next/navigation";
import PasswordField from "@/components/forms/PasswordField";

export default function LoginForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    // limpa erros no campo e erro geral
    setErrors((prev) => ({ ...prev, [name]: "", general: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const data = await login(formData);
      localStorage.setItem("token", data.token);
      router.push(`/post-login?redirectTo=${encodeURIComponent(redirectTo)}`);
    } catch (err: any) {
      // espera que o erro seja um objeto com mensagem { auth: "..." }
      if (err && typeof err === "object" && err.auth) {
        setErrors({ general: err.auth });
      } else {
        setErrors({ general: err.message || "Erro inesperado" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-800 p-6">
      <div className="w-full max-w-md bg-gray-900 shadow-lg rounded-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Login</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-gray-300 mb-1">Usuário</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          <div>
            <PasswordField
              label="Senha"
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              className={`w-full p-2 rounded bg-gray-800 text-white border ${
                errors.password ? "border-red-500" : "border-gray-700"
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
          </div>

          {errors.general && (
            <p className="text-red-500 text-center text-sm">{errors.general}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white font-semibold py-2 rounded transition-colors"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <p className="text-center text-sm text-gray-400">
            Não tem uma conta? <a href="/register" className="text-blue-400 hover:underline">Crie uma agora</a>
          </p>
        </form>
      </div>
    </div>
  );
}
