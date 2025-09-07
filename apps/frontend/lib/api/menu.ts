import { CreateMenuDto } from "@/app/type";
import { safeFetcher } from "../utils";

// 메뉴 생성
export const createMenu = async (menuData: CreateMenuDto) => {
  const response = await safeFetcher.post("menu", {
    json: menuData,
  });

  if (!response.ok) {
    throw new Error("메뉴 생성에 실패했습니다.");
  }

  return response.json();
};
