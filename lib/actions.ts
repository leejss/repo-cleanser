"use server";

import { Octokit } from "@octokit/rest";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { deleteRepositories } from "./service";
import { saveAsJson } from "./dev-utils";

export async function checkAuth() {
  const cookieStore = await cookies();
  const githubAccessToken = cookieStore.get("github_access_token");
  return !!githubAccessToken;
}

export async function getOctokit() {
  const cookieStore = await cookies();
  const githubAccessToken = cookieStore.get("github_access_token");

  if (!githubAccessToken) {
    throw new Error("Not authenticated");
  }

  return new Octokit({
    auth: githubAccessToken.value,
  });
}

export async function getOwner() {
  const octokit = await getOctokit();
  const { data } = await octokit.users.getAuthenticated();
  return data.login;
}

export async function getRepos() {
  const octokit = await getOctokit();
  const allRepos = await octokit.paginate(
    octokit.rest.repos.listForAuthenticatedUser,
    {
      per_page: 30,
      sort: "updated",
      direction: "desc",
    },
  );

  const data = allRepos.map((repo) => ({
    name: repo.name,
    url: repo.html_url,
    description: repo.description ?? "",
    owner: repo.owner.login,
    createdAt: repo.created_at ?? "",
    updatedAt: repo.updated_at ?? "",
    visibility: repo.visibility ?? "",
  }));
  return {
    data,
    totalCount: allRepos.length,
  };
}

export async function deleteSelectedRepos(repositoryNames: string[]) {
  const octokit = await getOctokit();
  const { data } = await octokit.users.getAuthenticated();
  const owner = data.login;

  const result = await deleteRepositories(octokit, owner, repositoryNames);

  revalidatePath("/");

  return result;
}

export async function disconnectGithub() {
  "use server";

  const cookieStore = await cookies();
  cookieStore.delete("github_access_token");

  revalidatePath("/");
  redirect("/");
}
