"use client";

import { useState } from "react";
import { register } from "@/services/auth";
import { useRouter } from "next/navigation";
import PasswordField from "@/components/forms/PasswordField";

export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  interface PasswordFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // limpa o erro do campo editado
    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validação local da senha
    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "As senhas não coincidem" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      router.push("/");
    } catch (err: any) {
      // se for um objeto de erros de campo (ex.: { email: "erro", password: "erro" })
      if (err && typeof err === "object" && !Array.isArray(err)) {
        setErrors(err);
      } else {
        setErrors({ general: "Erro inesperado" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-800 p-6">
      <div className="w-full max-w-md bg-gray-900 shadow-lg rounded-xl p-8 space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Criar Conta</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-gray-300 mb-1">Usuário</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              className={`w-full p-2 rounded bg-gray-800 text-white border ${
                errors.username ? "border-red-500" : "border-gray-700"
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-gray-300 mb-1">E-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 rounded bg-gray-800 text-white border ${
                errors.email ? "border-red-500" : "border-gray-700"
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
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

          <div>
            <label htmlFor="confirmPassword" className="block text-gray-300 mb-1">Confirmar Senha</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full p-2 rounded bg-gray-800 text-white border ${
                errors.confirmPassword ? "border-red-500" : "border-gray-700"
              } focus:outline-none focus:ring-2 focus:ring-green-500`}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Erro geral */}
          {errors.general && <p className="text-red-500 text-center text-sm">{errors.general}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white font-semibold py-2 rounded transition-colors"
          >
            {loading ? "Registrando..." : "Registrar"}
          </button>

          <p className="text-center text-sm text-gray-400">
            Já tem uma conta? <a href="/login" className="text-blue-400 hover:underline">Voltar para login</a>
          </p>
        </form>
      </div>
    </div>
  );
}