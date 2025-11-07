import { checkAuth, getOwner, getStarredRepos } from "@/lib/actions";
import StarredRepoList from "@/components/starred-repo-list";
import { redirect } from "next/navigation";

export default async function StarredPage() {
  const isAuth = await checkAuth();
  
  if (!isAuth) {
    redirect("/");
  }

  const owner = await getOwner();
  const { data, totalCount } = await getStarredRepos();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="rounded-xl bg-card p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                Starred Repositories
              </h1>
              <p className="text-muted-foreground">
                Repositories you've starred on GitHub
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {totalCount}
              </div>
              <div className="text-sm text-muted-foreground">
                Starred repositories
              </div>
            </div>
          </div>
        </div>
      </div>

      <StarredRepoList repos={data} />
    </div>
  );
}
