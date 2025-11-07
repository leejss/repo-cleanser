import ConnectButton from "@/components/connect-button";
import RepoList from "@/components/repo-list";
import { checkAuth, getOwner, getRepos, getStarredRepos } from "@/lib/actions";
import Link from "next/link";

export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const isAuth = await checkAuth();

  // URL 파라미터에서 에러나 성공 메시지 확인
  const error = searchParams.error as string;
  const authSuccess = searchParams.auth === 'success';
  if (isAuth) {
    const owner = await getOwner();
    const { data, totalCount } = await getRepos();
    const { totalCount: starredCount } = await getStarredRepos();

    return (
      <div className="container mx-auto px-4 py-8">
        {/* 인증 성공 메시지 */}
        {authSuccess && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 dark:bg-green-900/20 dark:border-green-800">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="ml-3 text-sm font-medium text-green-800 dark:text-green-200">
                GitHub 연동이 성공적으로 완료되었습니다!
              </p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <div className="rounded-xl bg-card p-6 shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  Welcome back, {owner}
                </h1>
                <p className="text-muted-foreground">
                  Manage your GitHub repositories efficiently
                </p>
              </div>
              <div className="text-right space-y-4">
                <div>
                  <div className="text-2xl font-bold text-primary">
                    {totalCount}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Total repositories
                  </div>
                </div>
                {starredCount > 0 && (
                  <div>
                    <Link
                      href="/starred"
                      className="inline-flex items-center gap-2 text-sm font-medium text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                      {starredCount} starred
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">
              Your Repositories
            </h2>
            <p className="text-sm text-muted-foreground">
              Select repositories to delete
            </p>
          </div>
          
          <RepoList repos={data || []} />
        </div>
      </div>
    );
  }
  
  // 에러 메시지 매핑
  const getErrorMessage = (errorCode: string) => {
    const errorMessages: Record<string, string> = {
      missing_params: "인증 과정에서 필요한 정보가 누락되었습니다.",
      expired_state: "인증 요청이 만료되었습니다. 다시 시도해주세요.",
      env_mismatch: "환경 설정 오류가 발생했습니다.",
      invalid_state: "잘못된 인증 요청입니다.",
      token_exchange_failed: "GitHub 토큰 교환에 실패했습니다.",
      no_access_token: "GitHub에서 액세스 토큰을 받지 못했습니다.",
    };
    return errorMessages[errorCode] || "알 수 없는 오류가 발생했습니다.";
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        {/* 에러 메시지 */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 dark:bg-red-900/20 dark:border-red-800">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="ml-3 text-sm font-medium text-red-800 dark:text-red-200">
                {getErrorMessage(error)}
              </p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Repo Remover
          </h1>
          <p className="text-lg text-muted-foreground mb-2">
            GitHub Repository Manager
          </p>
          <p className="text-sm text-muted-foreground">
            Connect your GitHub account to manage and clean up your repositories
          </p>
        </div>

        <div className="rounded-xl bg-card p-8 shadow-sm border">
          <ConnectButton />
        </div>
      </div>
    </div>
  );
}
