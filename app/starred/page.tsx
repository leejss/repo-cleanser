import { checkAuth, getStarredRepos } from "@/lib/actions";
import StarredRepoList from "@/components/starred-repo-list";
import { redirect } from "next/navigation";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function StarredPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const isAuth = await checkAuth();

  if (!isAuth) {
    redirect("/");
  }

  const params = await searchParams;
  const page = typeof params.page === "string" ? parseInt(params.page, 10) : 1;
  const { data, pagination } = await getStarredRepos(page);

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
                Repositories you&apos;ve starred on GitHub
              </p>
            </div>
          </div>
        </div>
      </div>
      <StarredRepoList repos={data} pagination={pagination} />
    </div>
  );
}
