import { RegisterForm } from '@/components/forms/register-form'

export default function Register () {
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Crear cuenta</h1>
        <p className="text-balance text-zinc-400">
          Ingrese sus datos para crear una cuenta
        </p>
      </div>
      <RegisterForm />
    </div>
  )
}
