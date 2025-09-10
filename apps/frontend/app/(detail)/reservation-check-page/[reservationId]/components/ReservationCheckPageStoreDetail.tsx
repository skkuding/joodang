import type { ReservationResponse } from "@/app/type";
import Image from "next/image";
import { formatDateWithDay, formatToHHMM } from "@/lib/utils";
import OrangeDot from "@/public/icons/orange_dot.svg";

interface ReservationCheckPageStoreDetailProps {
  reservation: ReservationResponse | null;
}
export function ReservationCheckPageStoreDetail({
  reservation,
}: ReservationCheckPageStoreDetailProps) {
  return (
    <>
      {reservation?.timeSlot.totalCapacity === -1 ? (
        <div className="flex flex-col gap-6">
          <div className="flex">
            <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
            <div className="ml-2 flex w-full justify-between">
              <p>현장 대기 번호</p>
              <p className="text-color-common-0">
                {reservation?.reservationNum}번
              </p>
            </div>
          </div>
          <div className="flex">
            <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
            <div className="ml-2 flex w-full justify-between">
              <p>총 인원</p>
              <p className="text-color-common-0">{reservation?.headcount}명</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex">
            <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
            <div className="ml-2 flex w-full justify-between">
              <p>날짜</p>
              <p className="text-color-common-0">
                {formatDateWithDay(
                  reservation ? reservation.timeSlot.startTime : ""
                )}
              </p>
            </div>
          </div>
          <div className="flex">
            <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
            <div className="ml-2 flex w-full justify-between">
              <p>시간대</p>
              <p className="text-color-common-0">
                {formatToHHMM(
                  reservation ? reservation.timeSlot.startTime : ""
                )}{" "}
                ~{" "}
                {formatToHHMM(reservation ? reservation.timeSlot.endTime : "")}
              </p>
            </div>
          </div>
          <div className="flex">
            <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
            <div className="ml-2 flex w-full justify-between">
              <p>총 인원</p>
              <p className="text-color-common-0">{reservation?.headcount}명</p>
            </div>
          </div>
          <div className="flex">
            <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
            <div className="ml-2 flex w-full justify-between">
              <p>예약 번호</p>
              <p className="text-color-common-0">
                {reservation?.reservationNum}번
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
