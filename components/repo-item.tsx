import { formatDate } from "@/lib/format";

type RepoData = {
  name: string;
  url: string;
  description: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  visibility: string;
};

type RepoItemProps = {
  repo: RepoData;
  isSelected: boolean;
  onToggle: () => void;
};

export default function RepoItem({
  repo,
  isSelected,
  onToggle,
}: RepoItemProps) {
  return (
    <div
      className={`group rounded-lg border bg-card p-4 transition-all duration-200 hover:shadow-md ${
        isSelected 
          ? "border-primary/50 bg-primary/5 shadow-sm" 
          : "border-border hover:border-primary/30"
      }`}
    >
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
          </div>
          
          <div className="space-y-2">
            {repo.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {repo.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <svg 
                  className="h-3 w-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
                Updated {formatDate(repo.updatedAt)}
              </div>
              <div className="flex items-center gap-1">
                <svg 
                  className="h-3 w-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                  />
                </svg>
                {repo.owner}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onToggle}
          className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 whitespace-nowrap ${
            isSelected
              ? "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {isSelected ? (
            <>
              <svg 
                className="h-4 w-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M6 18L18 6M6 6l12 12" 
                />
              </svg>
              선택 해제
            </>
          ) : (
            <>
              <svg 
                className="h-4 w-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
              선택
            </>
          )}
        </button>
      </div>
    </div>
  );
}
