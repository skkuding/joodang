"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getReservationById,
  updateReservationStatus,
  callReservation,
} from "@/lib/api/reservation";
import { DetailHeader } from "@/app/components/DetailHeader";
import { ReservationResponse } from "@/app/type";
import { formatDateWithDay, formatPhone010 } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import Link from "next/link";
import { toast } from "sonner";

function StatusBadge({ reservation }: { reservation: ReservationResponse }) {
  const base = "rounded px-2 py-1 text-xs font-medium";
  if (reservation.isConfirmed === true) {
    return (
      <span className={`${base} text-primary-normal bg-red-50`}>예약 확정</span>
    );
  }
  if (reservation.isConfirmed === false) {
    return (
      <span className={`${base} bg-color-neutral-99 text-color-neutral-70`}>
        예약 반려
      </span>
    );
  }
  return (
    <span className={`${base} bg-color-neutral-99 text-color-neutral-70`}>
      미정
    </span>
  );
}

export default function ReservationDetailPage() {
  const params = useParams<{ reservationId: string }>();
  const reservationId = Number(params?.reservationId);

  const [reservation, setReservation] = useState<ReservationResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAmountDrawerOpen, setIsAmountDrawerOpen] = useState(false);
  const [confirmAmount, setConfirmAmount] = useState<string>("");
  const [isRejectDrawerOpen, setIsRejectDrawerOpen] = useState(false);

  const loadDetail = async () => {
    if (!reservationId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getReservationById(reservationId);
      setReservation(data);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "예약 정보를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetail();
  }, [reservationId]);

  const handleConfirm = async () => {
    if (!reservation) return;
    // 금액 확인 모달 표시
    const defaultAmount = String(
      reservation.headcount * reservation.store.reservationFee
    );
    setConfirmAmount(defaultAmount);
    setIsAmountDrawerOpen(true);
  };

  const handleReject = async () => {
    if (!reservation) return;
    // 반려 확인 드로어 열기
    setIsRejectDrawerOpen(true);
  };

  const handleCall = async () => {
    if (!reservation) return;
    try {
      await callReservation(reservation.id);
      toast.success("푸시 알림을 전송하는데 성공하였습니다!");
    } catch {}
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-gray-500">불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-primary-normal">{error}</div>
      </div>
    );
  }

  if (!reservation) return null;

  const date = new Date(reservation.timeSlot.startTime);
  const dateLabel = formatDateWithDay(date);
  const timeLabel = `${String(new Date(reservation.timeSlot.startTime).getHours()).padStart(2, "0")}:${String(new Date(reservation.timeSlot.startTime).getMinutes()).padStart(2, "0")} ~ ${String(new Date(reservation.timeSlot.endTime).getHours()).padStart(2, "0")}:${String(new Date(reservation.timeSlot.endTime).getMinutes()).padStart(2, "0")}`;

  return (
    <div className="flex flex-col">
      <DetailHeader />
      <div className="flex items-center justify-between p-5">
        <div>
          <div className="text-primary-normal text-xs">
            {reservation.store.college} | {reservation.store.organizer}
          </div>
          <div className="text-xl font-medium">{reservation.store.name}</div>
        </div>
        <StatusBadge reservation={reservation} />
      </div>
      <div className="bg-color-neutral-99 h-2.5"></div>
      <div className="flex-1 bg-white p-5">
        <div className="space-y-5 text-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
              <span className="text-color-neutral-30 text-sm">
                {reservation.timeSlot.totalCapacity === -1
                  ? "현장 대기 번호"
                  : "예약 번호"}
              </span>
            </div>
            <div>{reservation.reservationNum}번</div>
          </div>
          {reservation.timeSlot.totalCapacity !== -1 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
                <span className="text-color-neutral-30 text-sm">날짜</span>
              </div>
              <div>{dateLabel}</div>
            </div>
          )}
          {reservation.timeSlot.totalCapacity !== -1 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
                <span className="text-color-neutral-30 text-sm">시간대</span>
              </div>
              <div>{timeLabel}</div>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
              <span className="text-color-neutral-30 text-sm">연락처</span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`tel:${reservation.phone}`}
                className="text-primary-normal rounded bg-red-50 px-2 py-1 text-xs"
              >
                전화 걸기
              </Link>
              <div>{formatPhone010(reservation.phone)}</div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
              <span className="text-color-neutral-30 text-sm">총 인원</span>
            </div>
            <div>{reservation.headcount}명</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
              <span className="text-color-neutral-30 text-sm">예약 금액</span>
            </div>
            <div>
              {reservation.headcount * reservation.store.reservationFee}원
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 영역 */}
      {(reservation.isConfirmed === true ||
        reservation.isConfirmed === null) && (
        <div className="z-11 fixed bottom-0 w-full bg-white p-4">
          {reservation.isConfirmed === true && (
            <button
              onClick={handleCall}
              className="bg-primary-normal w-full rounded-lg py-4 text-white"
            >
              호출하기
            </button>
          )}

          {reservation.isConfirmed === null && (
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                className="border-primary-normal text-primary-normal w-1/2 rounded-lg border py-[14px] font-medium"
              >
                예약 반려하기
              </button>
              <button
                onClick={
                  reservation.timeSlot.totalCapacity === -1
                    ? async () => {
                        await handleCall();
                        await updateReservationStatus(reservation.id, true);
                        await loadDetail();
                      }
                    : handleConfirm
                }
                className="bg-primary-normal w-1/2 rounded-lg py-[14px] font-medium text-white"
              >
                {reservation.timeSlot.totalCapacity === -1
                  ? "호출하기"
                  : "예약 확정하기"}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 금액 확인 드로어 */}
      <Drawer open={isAmountDrawerOpen} onOpenChange={setIsAmountDrawerOpen}>
        <DrawerContent className="h-[50vh]">
          <DrawerHeader>
            <DrawerTitle>예약 금액 확인</DrawerTitle>
          </DrawerHeader>
          <div className="px-5 pb-5">
            <div className="mb-4 text-sm text-gray-600">
              확정 전에 예약 금액이 입금되었는지 확인해주세요.
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-500">예약 금액</label>
              <input
                inputMode="numeric"
                disabled={true}
                className="w-full rounded-md border border-gray-200 p-3"
                value={`${confirmAmount}원`}
                onChange={e => setConfirmAmount(e.target.value)}
                min={0}
              />
            </div>
          </div>
          <DrawerFooter>
            <div className="flex gap-3">
              <button
                onClick={() => setIsAmountDrawerOpen(false)}
                className="border-primary-normal text-primary-normal w-1/2 rounded-lg border py-3"
              >
                취소
              </button>
              <button
                onClick={async () => {
                  setIsAmountDrawerOpen(false);
                  await updateReservationStatus(reservation.id, true);
                  await loadDetail();
                }}
                className="bg-primary-normal w-1/2 rounded-lg py-3 text-white"
              >
                금액 확인 후 확정
              </button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* 예약 반려 확인 드로어 */}
      <Drawer open={isRejectDrawerOpen} onOpenChange={setIsRejectDrawerOpen}>
        <DrawerContent className="h-[40vh]">
          <DrawerHeader>
            <DrawerTitle>정말 예약을 반려하시겠습니까?</DrawerTitle>
          </DrawerHeader>
          <div className="px-5 pb-5 text-sm text-gray-600">
            입금된 금액은 예약자에게 직접 환불해야 합니다.
          </div>
          <DrawerFooter>
            <div className="flex gap-3">
              <button
                onClick={() => setIsRejectDrawerOpen(false)}
                className="border-primary-normal text-primary-normal w-1/2 rounded-lg border py-3"
              >
                취소
              </button>
              <button
                onClick={async () => {
                  if (!reservation) return;
                  setIsRejectDrawerOpen(false);
                  await updateReservationStatus(reservation.id, false);
                  await loadDetail();
                }}
                className="bg-primary-normal w-1/2 rounded-lg border py-3 text-white"
              >
                반려 확인
              </button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
