import type { Octokit } from "@octokit/rest";
import { saveAsJson } from "./dev-utils";

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

/**
 * Parse GitHub's Link header to extract pagination URLs
 * Link header format: <url>; rel="next", <url>; rel="last"
 */
function parseLinkHeader(linkHeader: string | undefined): {
  next?: number;
  prev?: number;
  first?: number;
  last?: number;
} {
  if (!linkHeader) return {};

  const links: Record<string, number> = {};
  const parts = linkHeader.split(",");

  for (const part of parts) {
    const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match) {
      const url = match[1];
      const rel = match[2];
      const pageMatch = url.match(/[?&]page=(\d+)/);
      if (pageMatch) {
        links[rel] = parseInt(pageMatch[1], 10);
      }
    }
  }

  return links;
}

export async function getStarredRepositories(
  octokit: Octokit,
  page: number = 1,
  perPage: number = 30,
) {
  const response =
    await octokit.rest.activity.listReposStarredByAuthenticatedUser({
      per_page: perPage,
      page,
      sort: "created",
      direction: "desc",
    });

  const linkHeader = response.headers.link;
  const pagination = parseLinkHeader(linkHeader);

  saveAsJson(response.data, `starred-repos-page-${page}.json`);

  return {
    data: response.data.map((repo) => ({
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
    })),
    pagination: {
      currentPage: page,
      hasNext: !!pagination.next,
      hasPrev: !!pagination.prev,
      nextPage: pagination.next,
      prevPage: pagination.prev,
      firstPage: pagination.first,
      lastPage: pagination.last,
    },
  };
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
