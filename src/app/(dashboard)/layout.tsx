import Link from "next/link"
import { Upload, Video, History, LayoutDashboard, LogOut } from "lucide-react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <aside className="w-64 border-r bg-white dark:bg-zinc-900 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b font-bold text-xl">
          OmniPresenceAI
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 text-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
            <LayoutDashboard className="h-4 w-4" /> Overview
          </Link>
          <Link href="/studio" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 text-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
            <Video className="h-4 w-4" /> The Studio
          </Link>
          <Link href="/assets" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 text-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
            <Upload className="h-4 w-4" /> Asset Library
          </Link>
          <Link href="/history" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-zinc-100 text-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800">
            <History className="h-4 w-4" /> Run History
          </Link>
        </nav>
        <div className="p-4 border-t">
          {/* We will wire this up to Zustand logout later */}
          <button className="flex items-center gap-3 px-3 py-2 w-full text-sm font-medium rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 border-b bg-white dark:bg-zinc-900 flex items-center px-8">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </header>
        <div className="flex-1 p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
