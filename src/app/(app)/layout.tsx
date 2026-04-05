import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { MobileTabBar } from '@/components/layout/MobileTabBar'

export const dynamic = 'force-dynamic'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const isAdmin = user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar_url')
    .eq('id', user.id)
    .single()

  return (
    <SidebarProvider>
      <div className="flex min-h-svh w-full">
        <AppSidebar user={user} isAdmin={isAdmin} profile={profile} />
        <main className="flex-1 min-w-0 pb-16 lg:pb-0">
          {children}
        </main>
        <MobileTabBar />
      </div>
    </SidebarProvider>
  )
}
