import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Join } from './join'

export default async function JoinInvitation ({ params } : { params: { code: string } }) {
  const code = params.code

  if (!code) {
    notFound()
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-2 max-w-[350px] mx-auto">
      <Suspense fallback={<div>Cargando...</div>}>
        <Join code={code} />
      </Suspense>
    </div>
  )
}
