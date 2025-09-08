import { safeFetcher } from "../utils";

// 사용자 정보 타입
export interface User {
  id: number;
  email: string;
  name: string;
  phone?: string;
  // 필요한 다른 필드들 추가
}

// 현재 사용자 정보 조회
export const getCurrentUser = async (): Promise<User> => {
  const response = await safeFetcher.get("user/me");

  if (!response.ok) {
    throw new Error("사용자 정보를 불러오는데 실패했습니다.");
  }

  return response.json();
};
