"use server";

import { Octokit } from "@octokit/rest";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { deleteRepositories } from "./service";

export async function deleteSelectedRepos(repositoryNames: string[]) {
  const cookieStore = await cookies();
  const githubAccessToken = cookieStore.get("github_access_token");

  if (!githubAccessToken) {
    throw new Error("Not authenticated");
  }

  const octokit = new Octokit({
    auth: githubAccessToken.value,
  });

  const { data } = await octokit.users.getAuthenticated();
  const owner = data.login;

  const result = await deleteRepositories(octokit, owner, repositoryNames);
  
  revalidatePath("/");
  
  return result;
}
