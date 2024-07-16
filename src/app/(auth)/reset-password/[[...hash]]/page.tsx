import { ResetPasswordForm } from '@/components/forms/reset-password'
import { isValidChangePassword } from '@/lib/data'
import { notFound } from 'next/navigation'

export default async function ResetPassword ({ params } : { params: { hash: string[] } }) {
  const code = params?.hash ? params.hash[0] : null

  if (!code) {
    notFound()
  }

  const [requestChangePassword] = await Promise.all([
    isValidChangePassword(params.hash.join('/'))
  ])

  if (!requestChangePassword) {
    notFound()
  }

  return (
    <div className="mx-auto grid w-[350px] gap-6">
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Nueva contraseña</h1>
        <p className="text-balance text-zinc-400">
          Actualiza tu contreseña aquí. Anótala en algún lado para poder recordarla facilmente.
        </p>
      </div>
      <ResetPasswordForm code={code} />
    </div>
  )
}
