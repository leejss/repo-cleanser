"use client";

import { useState, useEffect } from "react";
import { starRepo, unstarRepo, checkIfRepoIsStarred } from "@/lib/actions";

type StarButtonProps = {
  owner: string;
  name: string;
  className?: string;
};

export default function StarButton({ owner, name, className = "" }: StarButtonProps) {
  const [isStarred, setIsStarred] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkStarStatus = async () => {
      try {
        const starred = await checkIfRepoIsStarred(owner, name);
        setIsStarred(starred);
      } catch (error) {
        console.error("Failed to check star status:", error);
        setIsStarred(false);
      }
    };

    checkStarStatus();
  }, [owner, name]);

  const handleToggleStar = async () => {
    if (isStarred === null) return;
    
    setIsLoading(true);
    try {
      if (isStarred) {
        await unstarRepo(owner, name);
        setIsStarred(false);
      } else {
        await starRepo(owner, name);
        setIsStarred(true);
      }
    } catch (error) {
      console.error("Failed to toggle star:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isStarred === null) {
    return (
      <button
        disabled
        className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 ${className}`}
      >
        <svg className="h-3 w-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
        </svg>
        ...
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleStar}
      disabled={isLoading}
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
        isStarred
          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:hover:bg-yellow-900/30"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
      } ${className}`}
    >
      {isLoading ? (
        <>
          <svg className="h-3 w-3 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          ...
        </>
      ) : (
        <>
          <svg 
            className="h-3 w-3" 
            fill={isStarred ? "currentColor" : "none"} 
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
          {isStarred ? "Starred" : "Star"}
        </>
      )}
    </button>
  );
}
