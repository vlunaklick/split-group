import { notFound } from 'next/navigation'
import { ResetPasswordForm } from './reset-password-form'
import { Metadata } from 'next'
import { isValidChangePassword } from './actions'

export const metadata: Metadata = {
  title: 'Recuperar contraseña',
  description: 'Recupera el acceso a tu cuenta'
}

export default async function ResetPassword ({ params } : { params: { hash: string[] } }) {
  const code = params?.hash ? params.hash[0] : null

  if (!code) {
    notFound()
  }

  const isValidCode = await isValidChangePassword(code)

  if (!isValidCode) {
    notFound()
  }

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Nueva contraseña</h1>
        <p className="text-balance text-muted-foreground">
          Elige una contraseña nueva. Guárdala en un lugar seguro para no olvidarla.
        </p>
      </div>
      <ResetPasswordForm code={code} />
    </div>
  )
}
