import { Moon, Sun, LayoutDashboard, Kanban, Sailboat } from "lucide-react";

export default function Header({ theme, setTheme, activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-600 text-white dark:bg-sky-500">
            <Sailboat className="h-5 w-5" />
          </div>
          <h1 className="text-lg font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            JobSail
          </h1>
          <span className="hidden text-sm text-zinc-400 dark:text-zinc-500 sm:inline">— Your Career Compass</span>
        </div>

        <div className="flex items-center gap-1">
          <div className="flex rounded-lg border border-zinc-200 bg-zinc-100 p-0.5 dark:border-zinc-800 dark:bg-zinc-900">
            <button
              className={`flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition ${
                activeTab === "kanban"
                  ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
              onClick={() => setActiveTab("kanban")}
              aria-label="Kanban view"
            >
              <Kanban className="h-4 w-4" />
              <span className="hidden sm:inline">Board</span>
            </button>
            <button
              className={`flex h-8 items-center gap-1.5 rounded-md px-3 text-sm font-medium transition ${
                activeTab === "dashboard"
                  ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-800 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
              }`}
              onClick={() => setActiveTab("dashboard")}
              aria-label="Dashboard view"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Stats</span>
            </button>
          </div>

          <button
            className="ml-2 flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
