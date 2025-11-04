import ConnectButton from "@/components/connect-button";
import RepoList from "@/components/repo-list";
import { checkAuth, getOwner, getRepos } from "@/lib/actions";

export default async function HomePage() {
  if (await checkAuth()) {
    const owner = await getOwner();
    const repos = await getRepos();

    return (
      <div className="font-mono">
        <h1 className="text-2xl font-bold p-4">Welcome, {owner}</h1>
        <RepoList repos={repos || []} />
      </div>
    );
  }
  return (
    <div>
      <ConnectButton />
    </div>
  );
}
