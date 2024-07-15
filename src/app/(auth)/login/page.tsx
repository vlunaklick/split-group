import { LoginForm } from '@/components/login/form'
import Image from 'next/image'
import Link from 'next/link'

export default function SignIn () {
  return (
    <main className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px] h-screen">
      <section className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Iniciar sesión</h1>
            <p className="text-balance text-zinc-400">
              Ingrese su nombre de usuario y contraseña para acceder a su cuenta
            </p>
          </div>
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            No tienes cuenta?{' '}
            <Link href="#" className="underline">
              Registrate
            </Link>
          </div>
        </div>
      </section>
      <section className="hidden bg-muted lg:block">
        <Image
          src="/login.avif"
          alt="Image"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </section>
    </main>
  )
}
