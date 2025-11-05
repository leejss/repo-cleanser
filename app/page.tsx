import ConnectButton from "@/components/connect-button";
import RepoList from "@/components/repo-list";
import { checkAuth, getOwner, getRepos } from "@/lib/actions";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const params = await searchParams;
  const page = params.page;
  const isAuth = await checkAuth();
  if (isAuth) {
    const owner = await getOwner();
    const repos = await getRepos(Number(page ?? "1"));

    return (
      <div className="font-mono">
        <h1 className="text-2xl font-bold p-4 max-w-5xl mx-auto">
          Welcome, {owner}
        </h1>
        <RepoList repos={repos || []} />
      </div>
    );
  }
  return (
    <div className="h-dvh flex justify-center items-center">
      <div>
        <ConnectButton />
      </div>
    </div>
  );
}
