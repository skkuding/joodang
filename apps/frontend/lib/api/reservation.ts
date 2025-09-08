import { ReservationResponse } from "@/app/type";
import { safeFetcher } from "../utils";

// 예약 상태 타입
export type ReservationStatus = "pending" | "confirmed" | "rejected";

// 스토어 예약 목록 조회
export const getStoreReservations = async (
  storeId: number,
  filters?: {
    isConfirmed?: boolean;
    toBeConfirmed?: boolean;
    isWalkIn?: boolean;
  }
): Promise<ReservationResponse[]> => {
  const params = new URLSearchParams();

  if (filters?.isConfirmed !== undefined) {
    params.append("isConfirmed", filters.isConfirmed.toString());
  }
  if (filters?.toBeConfirmed !== undefined) {
    params.append("toBeConfirmed", filters.toBeConfirmed.toString());
  }
  if (filters?.isWalkIn !== undefined) {
    params.append("isWalkIn", filters.isWalkIn.toString());
  }

  const queryString = params.toString();
  const url = `reservation/store/${storeId}${queryString ? `?${queryString}` : ""}`;

  const response = await safeFetcher.get(url);

  if (!response.ok) {
    throw new Error("예약 목록을 불러오는데 실패했습니다.");
  }

  return response.json();
};

// 예약 상태 업데이트 (확정/반려)
export const updateReservationStatus = async (
  reservationId: number,
  isConfirm: boolean
): Promise<ReservationResponse> => {
  const response = await safeFetcher.patch(
    `reservation/${reservationId}/confirm?isConfirm=${isConfirm}`
  );

  if (!response.ok) {
    throw new Error(
      isConfirm ? "예약 확정에 실패했습니다." : "예약 반려에 실패했습니다."
    );
  }

  return response.json();
};

// 예약 단건 조회
export const getReservationById = async (
  reservationId: number
): Promise<ReservationResponse> => {
  const response = await safeFetcher.get(`reservation/${reservationId}`);

  if (!response.ok) {
    throw new Error("예약 정보를 불러오는데 실패했습니다.");
  }

  return response.json();
};

// 예약 호출(콜) 트리거
export const callReservation = async (reservationId: number) => {
  const response = await safeFetcher.post(`reservation/call/${reservationId}`);

  if (!response.ok) {
    throw new Error("호출하기 요청에 실패했습니다.");
  }

  return response.json().catch(() => undefined);
};

// 사용자 예약 목록 조회
export const getUserReservations = async (): Promise<ReservationResponse[]> => {
  const response = await safeFetcher.get("reservation");

  if (!response.ok) {
    throw new Error("예약 목록을 불러오는데 실패했습니다.");
  }

  return response.json();
};
