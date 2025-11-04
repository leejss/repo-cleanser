import ConnectButton from "@/components/connect-button";
import RepoList from "@/components/repo-list";
import { getOwner } from "@/lib/service";
import { Octokit } from "@octokit/rest";
import { cookies } from "next/headers";

export default async function HomePage() {
  const cookieStore = await cookies();
  const githubAccessToken = cookieStore.get("github_access_token");
  if (githubAccessToken) {
    const client = new Octokit({
      auth: githubAccessToken.value,
    });
    const owner = await getOwner(client);
    const repos = await client.repos.listForAuthenticatedUser({
      per_page: 100,
      sort: "updated",
      direction: "desc",
    });

    const repoData = repos.data.map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      description: repo.description ?? "",
      owner: repo.owner.login,
      createdAt: repo.created_at ?? "",
      updatedAt: repo.updated_at ?? "",
      visibility: repo.visibility ?? "",
    }));

    return (
      <div className="font-mono">
        <h1 className="text-2xl font-bold p-4">Welcome, {owner}</h1>
        <RepoList repos={repoData} />
      </div>
    );
  }
  return (
    <div>
      <ConnectButton />
    </div>
  );
}
