"use client";

import { useState } from "react";
import RepoItem from "./repo-item";
import { deleteSelectedRepos } from "@/lib/actions";
import ConfirmDialog from "./confirm-dialog";
import AlertDialog from "./alert-dialog";

type RepoData = {
  name: string;
  url: string;
  description: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
  visibility: string;
};

type SelectedRepo = {
  owner: string;
  name: string;
};

export default function RepoList({ repos }: { repos: RepoData[] }) {
  const [selectedRepos, setSelectedRepos] = useState<SelectedRepo[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [alert, setAlert] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant: "success" | "error";
  }>({ isOpen: false, title: "", message: "", variant: "success" });

  const handleToggleRepo = (owner: string, name: string) => {
    setSelectedRepos((prev) => {
      const exists = prev.some(
        (repo) => repo.owner === owner && repo.name === name,
      );

      if (exists) {
        // 이미 선택된 경우 제거
        return prev.filter(
          (repo) => !(repo.owner === owner && repo.name === name),
        );
      } else {
        // 선택되지 않은 경우 추가
        return [...prev, { owner, name }];
      }
    });
  };

  const isSelected = (owner: string, name: string) => {
    return selectedRepos.some(
      (repo) => repo.owner === owner && repo.name === name,
    );
  };

  const handleClickBulkDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteSelectedRepos(selectedRepos.map((repo) => repo.name));
      setSelectedRepos([]);
      setIsDialogOpen(false);
      setAlert({
        isOpen: true,
        title: "삭제 완료",
        message: `${selectedRepos.length}개의 레포지토리가 성공적으로 삭제되었습니다.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting repositories:", error);
      setIsDialogOpen(false);
      setAlert({
        isOpen: true,
        title: "삭제 실패",
        message:
          error instanceof Error
            ? error.message
            : "레포지토리 삭제 중 오류가 발생했습니다.",
        variant: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <ConfirmDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onConfirm={handleClickBulkDelete}
        title="레포지토리 삭제"
        message={`정말로 ${selectedRepos.length}개의 레포지토리를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmText="삭제"
        cancelText="취소"
        variant="danger"
        isLoading={isDeleting}
      />
      <AlertDialog
        isOpen={alert.isOpen}
        onClose={() => setAlert({ ...alert, isOpen: false })}
        title={alert.title}
        message={alert.message}
        variant={alert.variant}
      />
      <div>
        {selectedRepos.length > 0 && (
          <div className="sticky top-16 z-40 bg-card border-b p-4 mb-4 shadow-sm">
            <div className="container mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-medium">
                    {selectedRepos.length}
                  </div>
                  <p className="text-sm font-medium">
                    선택된 레포지토리
                  </p>
                </div>
                <button
                  className="inline-flex items-center gap-2 rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground shadow-sm hover:bg-destructive/90 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <svg 
                    className="h-4 w-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
                    />
                  </svg>
                  선택한 레포지토리 삭제
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {repos.map((repo) => (
            <RepoItem
              key={`${repo.owner}/${repo.name}`}
              repo={repo}
              isSelected={isSelected(repo.owner, repo.name)}
              onToggle={() => handleToggleRepo(repo.owner, repo.name)}
            />
          ))}
        </div>
      </div>
    </>
  );
}
