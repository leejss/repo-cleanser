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
      className={`border-b border-neutral-500 p-4 transition-colors ${
        isSelected ? "bg-neutral-800" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between gap-4 mx-auto">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold hover:underline">
              <a href={repo.url} target="_blank" rel="noopener noreferrer">
                {repo.name}
              </a>
            </h2>
            <div className="text-xs font-sans leading-[18px] text-gray-100 rounded-full border border-gray-100 px-1.5">
              {repo.visibility}
            </div>
          </div>
          <div className="flex flex-col gap-2 text-sm">
            <p className="text-gray-200">{repo.description}</p>
            <p className="text-gray-300">
              Updated: {formatDate(repo.updatedAt)}
            </p>
          </div>
        </div>

        <button
          onClick={onToggle}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap ${
            isSelected
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-neutral-700 hover:bg-neutral-600 text-gray-200"
          }`}
        >
          {isSelected ? "선택 해제" : "선택"}
        </button>
      </div>
    </div>
  );
}
