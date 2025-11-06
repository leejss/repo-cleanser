import ConnectButton from "@/components/connect-button";
import RepoList from "@/components/repo-list";
import { checkAuth, getOwner, getRepos } from "@/lib/actions";

export default async function HomePage() {
  const isAuth = await checkAuth();
  if (isAuth) {
    const owner = await getOwner();
    const { data, totalCount } = await getRepos();

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="rounded-xl bg-card p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  Welcome back, {owner}
                </h1>
                <p className="text-muted-foreground">
                  Manage your GitHub repositories efficiently
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  {totalCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total repositories
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">
              Your Repositories
            </h2>
            <p className="text-sm text-muted-foreground">
              Select repositories to delete
            </p>
          </div>
          
          <RepoList repos={data || []} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Repo Remover
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            GitHub Repository Manager
          </p>
          <p className="text-sm text-muted-foreground">
            Connect your GitHub account to manage and clean up your repositories
          </p>
        </div>
        
        <div className="rounded-xl bg-card p-8 shadow-sm border">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}
