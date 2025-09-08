"use client";
import Calendar from "@/public/icons/icon_gray_calendar.svg";
import Clock from "@/public/icons/icon_gray_clock.svg";
import Person from "@/public/icons/icon_gray_person.svg";
import { ReservationResponse } from "@/app/type";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { formatDateWithDay, formatPhone010 } from "@/lib/utils";

interface ReservationListItemProps {
  reservation: ReservationResponse;
  compact?: boolean; // 현장 대기 등 간소 표시용
}

export default function ReservationListItem({
  reservation,
  compact = false,
}: ReservationListItemProps) {
  // 시간 포맷팅
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const timeSlot = `${formatTime(reservation.timeSlot.startTime)} ~ ${formatTime(reservation.timeSlot.endTime)}`;
  const date = formatDateWithDay(new Date(reservation.timeSlot.startTime));

  const getButtonConfig = () => {
    if (reservation.isConfirmed === null) {
      return {
        text: "미정",
        className: "bg-color-neutral-99 text-color-neutral-70",
      };
    } else if (reservation.isConfirmed === false) {
      return {
        text: "예약 반려",
        className: "bg-color-neutral-99 text-color-neutral-70",
      };
    } else {
      return {
        text: "예약 확정",
        className: "bg-red-50 text-primary-normal",
      };
    }
  };

  const buttonConfig = getButtonConfig();

  if (compact) {
    // 간소 형태 (현장 대기 탭 등)
    return (
      <div className="mb-3 rounded-lg border border-gray-100 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              대기번호 {reservation.reservationNum}번
            </span>
            <span
              className={`rounded px-2 py-1 text-xs font-medium ${buttonConfig.className}`}
            >
              {buttonConfig.text}
            </span>
          </div>
          <Link
            href={`/management/reservation/${reservation.id}`}
            className="text-color-neutral-40 flex items-center gap-1 text-xs"
          >
            상세보기
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-3 rounded-lg bg-white px-5 py-4 shadow-sm">
      <Link href={`/management/reservation/${reservation.id}`}>
        <span className="text-primary-normal text-xs">
          {reservation.reservationNum}번
        </span>
        <div className="mb-3 flex items-center justify-between">
          <span className="font-medium">{timeSlot}</span>
          <div
            className={`rounded px-2 py-1 text-xs font-medium transition-colors ${buttonConfig.className}`}
          >
            {buttonConfig.text}
          </div>
        </div>

        <div className="bg-color-neutral-99 text-color-neutral-20 space-y-1 rounded-md p-4 text-sm">
          <div className="flex items-center justify-between gap-2">
            <div className="text-color-neutral-40 flex items-center gap-2">
              <Image src={Calendar} alt="날짜" width={12} height={12} />
              <span>날짜</span>
            </div>
            <span className="font-medium">{date}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="text-color-neutral-40 flex items-center gap-2">
              <Image src={Clock} alt="예약자 번호" width={12} height={12} />
              <span>예약자 번호</span>
            </div>
            <span className="font-medium">
              {formatPhone010(reservation.phone)}
            </span>
          </div>
          <div className="text-color-neutral-40 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Image src={Person} alt="인원" width={12} height={12} />
              <span>인원</span>
            </div>
            <span className="font-medium">{reservation.headcount}명</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
