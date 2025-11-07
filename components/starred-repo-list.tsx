"use client";

import { useState } from "react";
import StarredRepoItem from "./starred-repo-item";

type StarredRepoData = {
  name: string;
  url: string;
  description: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  visibility: string;
  starredAt: string;
  language: string;
  stargazersCount: number;
  forksCount: number;
};

export default function StarredRepoList({
  repos,
}: {
  repos: StarredRepoData[];
}) {
  const [localRepos, setLocalRepos] = useState(repos);

  const handleUnstar = (owner: string, name: string) => {
    setLocalRepos((prev) =>
      prev.filter((repo) => !(repo.owner === owner && repo.name === name)),
    );
  };

  if (localRepos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto max-w-md">
          <svg
            className="mx-auto h-12 w-12 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            No starred repositories
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            You haven&apos;t starred any repositories yet. Star repositories you
            find interesting to see them here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Starred Repositories
          </h2>
          <p className="text-sm text-muted-foreground">
            {localRepos.length} starred{" "}
            {localRepos.length === 1 ? "repository" : "repositories"}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {localRepos.map((repo) => (
          <StarredRepoItem
            key={`${repo.owner}/${repo.name}`}
            repo={repo}
            onUnstar={handleUnstar}
          />
        ))}
      </div>
    </div>
  );
}
