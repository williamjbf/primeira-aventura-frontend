import RegisterForm from "@/components/users/RegisterForm";
import AuthAside from "@/components/layouts/AuthAside/AuthAside";

export default function RegisterPage() {
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2">
      <RegisterForm />
      <AuthAside
        title="Bem-vindo à aventura"
        subtitle='"Crie sua conta e comece a rolar os dados."'
      />
    </div>
  );
}