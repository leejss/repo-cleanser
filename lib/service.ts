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
