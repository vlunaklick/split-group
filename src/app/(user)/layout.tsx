import { Logo } from '@/components/logo'
import { UserNav, UserNavSkeleton } from '@/components/user-nav'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b px-4 md:px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <Logo />
          <span className="sr-only">Split Group</span>
        </Link>

        <Suspense fallback={<UserNavSkeleton />}>
          <UserNav className='ml-auto' />
        </Suspense>
      </header>
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
        {children}
      </main>
    </div>
  )
}
