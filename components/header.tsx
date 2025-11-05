import { checkAuth, disconnectGithub } from "@/lib/actions";

export default async function Header() {
  const isAuth = await checkAuth();
  return (
    <header className="flex bg-neutral-900 p-3 items-center justify-between">
      <h1 className="text-xl font-bold">Repo Remover</h1>
      {isAuth && (
        <form action={disconnectGithub}>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-semibold rounded-md hover:bg-gray-800 transition-colors duration-200"
          >
            Disconnect
          </button>
        </form>
      )}
    </header>
  );
}
