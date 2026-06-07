import { AppSidebar } from '@/components/app-sidebar'
import { Header } from '@/components/header'
import { SidebarProvider } from '@/components/ui/sidebar'

export function AppShell ({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex w-full min-w-0 flex-col">
        <Header />
        <main className="flex w-full min-w-0 flex-1 flex-col gap-6 overflow-x-hidden px-4 py-5 sm:px-5 lg:gap-8 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}
