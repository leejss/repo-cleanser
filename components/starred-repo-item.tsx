"use client";

import { formatDate } from "@/lib/format";
import { starRepo, unstarRepo } from "@/lib/actions";
import { useState } from "react";

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

type StarredRepoItemProps = {
  repo: StarredRepoData;
  onUnstar?: (owner: string, name: string) => void;
};

export default function StarredRepoItem({
  repo,
  onUnstar,
}: StarredRepoItemProps) {
  const [isUnstarring, setIsUnstarring] = useState(false);

  const handleUnstar = async () => {
    setIsUnstarring(true);
    try {
      await unstarRepo(repo.owner, repo.name);
      onUnstar?.(repo.owner, repo.name);
    } catch (error) {
      console.error("Failed to unstar repository:", error);
    } finally {
      setIsUnstarring(false);
    }
  };

  return (
    <div className="group rounded-lg border bg-card p-4 transition-all duration-200 hover:shadow-md border-border hover:border-primary/30">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-foreground hover:text-primary transition-colors truncate">
              <a 
                href={repo.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {repo.name}
              </a>
            </h3>
            
            <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
              repo.visibility === 'public' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
            }`}>
              {repo.visibility}
            </div>

            {repo.language && (
              <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                {repo.language}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            {repo.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {repo.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
                {repo.stargazersCount.toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                </svg>
                {repo.forksCount.toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Starred {formatDate(repo.starredAt)}
              </div>
              <div className="flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
                {repo.owner}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleUnstar}
          disabled={isUnstarring}
          className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUnstarring ? (
            <>
              <svg className="h-4 w-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Unstarring...
            </>
          ) : (
            <>
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              Unstar
            </>
          )}
        </button>
      </div>
    </div>
  );
}
