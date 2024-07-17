import { ForgotPasswordForm } from './forgot-password-form'

export default function ForgotPassword () {
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Recuperar contraseña</h1>
        <p className="text-balance text-zinc-400">
          Le enviaremos un correo con un enlace para restablecer la misma.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}
