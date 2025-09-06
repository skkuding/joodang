import { CreateStoreDto } from "@/app/type";
import { safeFetcher } from "../utils";

// 스토어 생성
export const createStore = async (storeData: CreateStoreDto) => {
  const response = await safeFetcher.post("store", {
    headers: { "Content-Type": "application/json" },
    json: storeData,
  });

  if (!response.ok) {
    throw new Error("스토어 생성에 실패했습니다.");
  }

  return response.json();
};

// 스토어 이미지 presigned URL 요청
export const getStoreImagePresignedUrl = async (
  storeId: number,
  uploadData: { fileIdx: number; contentType: string }
) => {
  const response = await safeFetcher.post(`store/${storeId}/image/presign`, {
    json: uploadData,
  });

  if (!response.ok) {
    throw new Error("이미지 업로드 URL 생성에 실패했습니다.");
  }

  return response.json();
};

// 메뉴 이미지 presigned URL 요청
export const getMenuImagePresignedUrl = async (uploadData: {
  storeId: number;
  fileIdx: number;
  contentType: string;
}) => {
  const response = await safeFetcher.post("menu/image/presign", {
    json: uploadData,
  });

  if (!response.ok) {
    throw new Error("메뉴 이미지 업로드 URL 생성에 실패했습니다.");
  }

  return response.json();
};

// S3에 직접 이미지 업로드
export const uploadToS3 = async (
  url: string,
  fields: Record<string, string>,
  file: File
) => {
  const formData = new FormData();

  // presigned POST의 fields 추가
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // 파일 추가
  formData.append("file", file);

  const response = await safeFetcher.post(url, {
    json: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error("이미지 업로드에 실패했습니다.");
  }

  return response;
};

// 스토어 이미지 URL 업데이트
export const updateStoreImageUrl = async (
  storeId: number,
  imageUrl: string
) => {
  const response = await safeFetcher.patch(`store/${storeId}`, {
    json: JSON.stringify({ imageUrl }),
  });

  if (!response.ok) {
    throw new Error("스토어 이미지 URL 업데이트에 실패했습니다.");
  }

  return response.json();
};
