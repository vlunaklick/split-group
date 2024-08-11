import { Metadata } from 'next'
import { ForgotPasswordForm } from './forgot-password-form'

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Forgot your password'
}

export default function ForgotPassword () {
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Recuperar contraseña</h1>
        <p className="text-balance text-muted-foreground">
          Le enviaremos un correo con un enlace para restablecer la misma.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}
