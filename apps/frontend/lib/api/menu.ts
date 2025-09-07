import { CreateMenuDto } from "@/app/type";

// 메뉴 생성
export const createMenu = async (menuData: CreateMenuDto) => {
  const response = await fetch("/api/menu", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(menuData),
  });

  if (!response.ok) {
    throw new Error("메뉴 생성에 실패했습니다.");
  }

  return response.json();
};
