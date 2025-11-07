import type { Octokit } from "@octokit/rest";

export async function getCurrentUser(octokit: Octokit) {
  const { data } = await octokit.users.getAuthenticated();
  return data;
}

export async function getOwner(octokit: Octokit) {
  const { data } = await octokit.users.getAuthenticated();
  return data.login;
}

export async function deleteRepository(
  octokit: Octokit,
  owner: string,
  repositoryName: string,
) {
  await octokit.repos.delete({
    owner,
    repo: repositoryName,
  });
}

export async function deleteRepositories(
  octokit: Octokit,
  owner: string,
  repositoryNames: string[],
) {
  const results: { name: string; success: boolean; error?: string }[] = [];

  for (const repositoryName of repositoryNames) {
    try {
      await deleteRepository(octokit, owner, repositoryName);
      results.push({ name: repositoryName, success: true });
    } catch (error) {
      results.push({
        name: repositoryName,
        success: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return results;
}

export async function getStarredRepositories(octokit: Octokit) {
  const allStarredRepos = await octokit.paginate(
    octokit.rest.activity.listReposStarredByAuthenticatedUser,
    {
      per_page: 100,
      sort: "created",
      direction: "desc",
    },
  );

  return allStarredRepos.map((repo) => ({
    name: repo.name,
    url: repo.html_url,
    description: repo.description ?? "",
    owner: repo.owner.login,
    createdAt: repo.created_at ?? "",
    updatedAt: repo.updated_at ?? "",
    visibility: repo.visibility ?? "",
    starredAt: repo.starred_at ?? "",
    language: repo.language ?? "",
    stargazersCount: repo.stargazers_count ?? 0,
    forksCount: repo.forks_count ?? 0,
  }));
}

export async function starRepository(
  octokit: Octokit,
  owner: string,
  repositoryName: string,
) {
  await octokit.activity.starRepoForAuthenticatedUser({
    owner,
    repo: repositoryName,
  });
}

export async function unstarRepository(
  octokit: Octokit,
  owner: string,
  repositoryName: string,
) {
  await octokit.activity.unstarRepoForAuthenticatedUser({
    owner,
    repo: repositoryName,
  });
}

export async function checkIfRepositoryIsStarred(
  octokit: Octokit,
  owner: string,
  repositoryName: string,
): Promise<boolean> {
  try {
    await octokit.activity.checkRepoIsStarredByAuthenticatedUser({
      owner,
      repo: repositoryName,
    });
    return true;
  } catch (error) {
    // If the repository is not starred, the API returns a 404
    return false;
  }
}
