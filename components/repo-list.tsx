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
          <div className="sticky top-0 bg-neutral-900 border-b border-neutral-500 p-4 mb-4">
            <div className="flex items-center justify-between">
              <p className="text-sm">
                선택된 레포지토리: <strong>{selectedRepos.length}개</strong>
              </p>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-semibold transition-colors"
                onClick={() => setIsDialogOpen(true)}
              >
                선택한 레포지토리 삭제
              </button>
            </div>
          </div>
        )}

        {repos.map((repo) => (
          <RepoItem
            key={`${repo.owner}/${repo.name}`}
            repo={repo}
            isSelected={isSelected(repo.owner, repo.name)}
            onToggle={() => handleToggleRepo(repo.owner, repo.name)}
          />
        ))}
      </div>
    </>
  );
}
