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

// 메뉴 삭제
export const deleteMenu = async (menuId: string) => {
  const response = await safeFetcher.delete(`menu/${menuId}`);

  if (!response.ok) {
    throw new Error("메뉴 삭제에 실패했습니다.");
  }

  return response.json();
};
