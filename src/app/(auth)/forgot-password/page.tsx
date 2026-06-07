import { Metadata } from 'next'
import { ForgotPasswordForm } from './forgot-password-form'

export const metadata: Metadata = {
  title: 'Recuperar contraseña',
  description: 'Recupera el acceso a tu cuenta'
}

export default function ForgotPassword () {
  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-display-md">Recuperar contraseña</h1>
        <p className="text-balance text-muted-foreground">
          Te enviaremos un correo con un enlace para restablecer tu contraseña.
        </p>
      </div>
      <ForgotPasswordForm />
    </div>
  )
}
