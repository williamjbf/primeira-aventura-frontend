import LoginForm from '@/components/users/LoginForm'
import AuthAside from '@/components/layouts/AuthAside/AuthAside'

export default function LoginPage() {
  return (
    <div className="h-screen grid grid-cols-1 md:grid-cols-2">
      <LoginForm />
      <AuthAside
        title="Seja bem-vindo"
        subtitle='"Entre para continuar sua jornada."'
      />
    </div>
  )
}