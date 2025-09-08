"use client";

import { ReservationResponse } from "@/app/type";
import { formatToHHMM, formatWithComma } from "@/lib/utils";
import Arrow from "@/public/icons/icon_arrow.svg";
import Location from "@/public/icons/icon_location.svg";
import Clock from "@/public/icons/orangeClock.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ReservationCardProps {
  data: ReservationResponse;
}

export default function ReservationCard({ data }: ReservationCardProps) {
  const router = useRouter();
  return (
    <div
      className="h-[174px] w-[335px] overflow-hidden rounded-[6px]"
      style={{ boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.12)" }}
      onClick={() => {
        router.push(`/reservation-check-page/${data.id}`);
      }}
    >
      <div className="px-5 pb-5 pt-[14px]">
        <div className="mb-[2px] text-xs font-normal leading-[140%] tracking-[-0.36px] text-[#FF5940]">
          {data.store.organizer}
        </div>
        <div className="mb-3 flex h-[22px] flex-row justify-between">
          <div className="text-color-common-0 text-base font-medium leading-[140%] tracking-[-0.48px]">
            {data.store.name}
          </div>
          <Image src={Arrow} alt="화살표" width={18} height={18} />
        </div>
        <div className="bg-color-neutral-99 flex h-[87px] w-[295px] flex-col items-start justify-center gap-1 self-stretch rounded-[6px] p-2">
          <div className="flex w-full flex-row items-center">
            <Image
              src={Location}
              alt="위치"
              width={16}
              height={16}
              className="mr-1"
            />
            <p className="text-color-neutral-40 font-sans text-sm font-normal leading-[150%] tracking-[-0.56px]">
              위치
            </p>
            <p className="text-color-neutral-20 ml-auto font-sans text-sm font-normal leading-[150%] tracking-[-0.56px]">
              {data.store.location}
            </p>
          </div>
          <div className="flex w-full flex-row items-center">
            <object
              data="icons/orangeClock.svg"
              width={12}
              height={12}
              className="ml-[2px] mr-1"
            />
            <p className="text-color-neutral-40 font-sans text-sm font-normal leading-[150%] tracking-[-0.56px]">
              운영 시간
            </p>
            <p className="text-color-neutral-20 ml-auto font-sans text-sm font-normal leading-[150%] tracking-[-0.56px]">
              {formatToHHMM(data.store.startTime)} ~{" "}
              {formatToHHMM(data.store.endTime)}
            </p>
          </div>
          <div className="flex w-full flex-row items-center">
            <Image
              src={Location}
              alt="돈"
              width={16}
              height={16}
              className="mr-1"
            />
            <p className="text-color-neutral-40 font-sans text-sm font-normal leading-[150%] tracking-[-0.56px]">
              입장료
            </p>
            <p className="text-color-neutral-20 ml-auto font-sans text-sm font-normal leading-[150%] tracking-[-0.56px]">
              인당 {formatWithComma(data.store.reservationFee)} 원
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
