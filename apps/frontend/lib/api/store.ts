import { CreateStoreDto, Store, StoreDetail, TimeSlot } from "@/app/type";
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
  uploadData: { fileIdx: string; contentType: string }
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
  fileIdx: string;
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
  fields: Record<string, string>,
  file: File
) => {
  console.log("sss");
  console.log({ ...fields, file: file });

  // FormData를 사용하여 파일과 필드들을 함께 전송
  const formData = new FormData();

  // fields의 모든 키-값 쌍을 FormData에 추가
  Object.entries(fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // 파일을 FormData에 추가
  formData.append("file", file);

  // S3 storage URL로 직접 업로드
  const response = await fetch("https://storage.joodang.com/joodang-assets", {
    method: "POST",
    body: formData,
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
    json: { imageUrl },
  });

  if (!response.ok) {
    throw new Error("스토어 이미지 URL 업데이트에 실패했습니다.");
  }

  return response.json();
};

// 스토어 상세 조회
export const getStoreDetail = async (storeId: number): Promise<StoreDetail> => {
  const response = await safeFetcher.get(`store/${storeId}`);

  if (!response.ok) {
    throw new Error("스토어 정보를 불러오는데 실패했습니다.");
  }

  return (await response.json()) as StoreDetail;
};

// 스토어 수정
export const updateStore = async (
  storeId: number,
  data: Partial<CreateStoreDto>
) => {
  const response = await safeFetcher.patch(`store/${storeId}`, {
    headers: { "Content-Type": "application/json" },
    json: data,
  });

  if (!response.ok) {
    throw new Error("스토어 수정에 실패했습니다.");
  }

  return response.json();
};

// 사용자가 소유한 스토어 목록 조회
export const getMyOwnedStores = async () => {
  const response = await safeFetcher.get("store?sort=my");

  if (!response.ok) {
    throw new Error("스토어 목록을 불러오는데 실패했습니다.");
  }

  const myManagedStores = (await response.json()) as Store[];

  const { getCurrentUser } = await import("./user");
  const currentUser = await getCurrentUser();

  const myOwnedStores = myManagedStores.filter(
    (store: Store) => store.ownerId === currentUser.id
  );

  return myOwnedStores;
};

// 사용자가 관리하는 스토어 목록 조회 (소유 + 스태프)
export const getMyManagedStores = async () => {
  const response = await safeFetcher.get("store?sort=my");
  
  if (!response.ok) {
    throw new Error("스토어 목록을 불러오는데 실패했습니다.");
  }

  const myStores = (await response.json()) as Store[];

  return myStores;
};

// 스토어의 타임슬롯 조회
export const getStoreTimeSlots = async (
  storeId: number
): Promise<TimeSlot[]> => {
  const response = await safeFetcher.get(`store/${storeId}`);

  if (!response.ok) {
    throw new Error("스토어 정보를 불러오는데 실패했습니다.");
  }

  const storeData = (await response.json()) as StoreDetail;
  return storeData.timeSlots || [];
};
