import { checkAuth, disconnectGithub } from "@/lib/actions";

export default async function Header() {
  const isAuth = await checkAuth();
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold tracking-tight">Repo Cleanser</h1>
          <span className="hidden text-sm text-muted-foreground sm:inline-block">
            GitHub Repository Manager
          </span>
        </div>

        {isAuth && (
          <form action={disconnectGithub}>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium text-secondary-foreground bg-secondary hover:bg-secondary/80 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Disconnect
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
