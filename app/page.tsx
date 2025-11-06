import ConnectButton from "@/components/connect-button";
import RepoList from "@/components/repo-list";
import { checkAuth, getOwner, getRepos } from "@/lib/actions";

export default async function HomePage() {
  const isAuth = await checkAuth();
  if (isAuth) {
    const owner = await getOwner();
    const { data, totalCount } = await getRepos();

    return (
      <div className="font-mono">
        <h1 className="text-2xl font-bold mx-auto py-2">
          Welcome, {owner}
          <div>
            <p>Total repositories: {totalCount}</p>
          </div>
        </h1>
        <RepoList repos={data || []} />
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
