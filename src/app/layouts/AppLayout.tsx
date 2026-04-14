import { Outlet } from 'react-router-dom'
import { TabBar } from '@/components/layout/TabBar'

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface-2">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <TabBar />
      </div>
    </div>
  )
}
