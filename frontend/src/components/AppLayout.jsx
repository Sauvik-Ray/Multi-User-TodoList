export default function AppLayout({ children }) {
  return (
    <div
      className="min-h-screen bg-gradient-to-b 
      from-background to-muted/40 
      dark:from-[#050505] dark:to-[#0e0e0e]
      flex flex-col"
    >
      {/* HEADER */}
      <header
        className="w-full border-b border-white/10
        bg-white/70 dark:bg-[#111827]/50 
        backdrop-blur-xl shadow-sm"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <h1
            className="text-lg font-semibold tracking-wide 
            text-gray-800 dark:text-gray-100"
          >
            Multi-User Todo List
          </h1>

          {/* Placeholder for future nav items */}
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {/* e.g., User Profile, Settings, Logout, etc. */}
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10">
        {children}
      </main>
    </div>
  );
}
