import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { NextRequest } from "next/server";

/**
 * 개발용: API 응답 결과를 JSON 파일로 저장하는 유틸리티 함수
 * @param data 저장할 데이터
 * @param filename 파일명 (확장자 제외)
 * @param subDir 하위 디렉토리 (선택사항)
 */
export function saveAsJson<T>(
  data: T,
  filename: string,
  subDir: "api" | "repos" | "debug" = "debug"
): void {
  // 개발 환경에서만 실행
  if (process.env.NODE_ENV !== "development") {
    return;
  }

  try {
    // 저장 디렉토리 생성
    const saveDir = join(process.cwd(), "dev-data", subDir);
    mkdirSync(saveDir, { recursive: true });

    // 파일 경로 생성
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filePath = join(saveDir, `${filename}_${timestamp}.json`);

    // 데이터 저장
    writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    
    console.log(`✅ Dev data saved: ${filePath}`);
  } catch (error) {
    console.error("❌ Failed to save dev data:", error);
  }
}

/**
 * 개발용: Request 객체의 정보를 저장하는 함수
 * @param request NextRequest 객체
 * @param filename 파일명 (확장자 제외)
 */
export function saveRequestInfo(
  request: NextRequest,
  filename: string
): void {
  const requestInfo = {
    url: request.url,
    method: request.method,
    headers: Object.fromEntries(request.headers.entries()),
    searchParams: Object.fromEntries(request.nextUrl.searchParams.entries()),
    timestamp: new Date().toISOString(),
  };

  saveAsJson(requestInfo, filename, "api");
}

/**
 * 개발용: GitHub API 응답을 저장하는 함수
 * @param response GitHub API 응답 데이터
 * @param endpoint API 엔드포인트명
 */
export function saveGitHubResponse<T>(response: T, endpoint: string): void {
  saveAsJson(response, `github_${endpoint}`, "repos");
}

/**
 * 개발용: 에러 정보를 저장하는 함수
 * @param error 에러 객체
 * @param context 에러 발생 컨텍스트
 */
export function saveError(error: unknown, context: string): void {
  const errorInfo = {
    context,
    timestamp: new Date().toISOString(),
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack,
    } : error,
  };

  saveAsJson(errorInfo, `error_${context}`, "debug");
}
