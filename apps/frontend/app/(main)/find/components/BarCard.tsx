"use client";

import { formatToHHMM, formatWithComma } from "@/lib/utils";
import Arrow from "@/public/icons/icon_arrow.svg";
import Location from "@/public/icons/icon_location.svg";
import Clock from "@/public/icons/orangeClock.svg";
import Money from "@/public/icons/orangeMoney.svg";
import Macju from "@/public/pictures/drinkMacju.png";
import Image from "next/image";

interface BarCardProps {
  id: number;
  organizer: string;
  name: string;
  location?: string;
  startTime: string;
  endTime: string;
  reservationFee: number;
}

export default function BarCard(information: BarCardProps) {
  console.log(
    "id: ",
    information.id,
    "start: ",
    information.startTime,
    "format start: ",
    formatToHHMM(information.startTime)
  );
  return (
    <div
      className="h-[284px] w-[335px] overflow-hidden rounded-[6px]"
      style={{ boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.12)" }}
    >
      <div
        className="h-[110px] w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${Macju.src})` }}
      ></div>

      <div className="px-5 pb-5 pt-[14px]">
        <div className="text-xs font-normal leading-[140%] tracking-[-0.36px] text-[#FF5940]">
          {information.organizer}
        </div>
        <div className="mb-3 flex h-[22px] flex-row justify-between">
          <div className="text-color-common-0 text-base font-medium leading-[140%] tracking-[-0.48px]">
            {information.name}
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
              {information.location}
            </p>
          </div>
          <div className="flex w-full flex-row items-center">
            <Image
              src={Clock}
              alt="시간"
              width={12}
              height={12}
              className="ml-[2px] mr-1"
            />
            <p className="text-color-neutral-40 font-sans text-sm font-normal leading-[150%] tracking-[-0.56px]">
              운영 시간
            </p>
            <p className="text-color-neutral-20 ml-auto font-sans text-sm font-normal leading-[150%] tracking-[-0.56px]">
              {formatToHHMM(information.startTime)} ~{" "}
              {formatToHHMM(information.endTime)}
            </p>
          </div>
          <div className="flex w-full flex-row items-center">
            <Image
              src={Money}
              alt="돈"
              width={16}
              height={16}
              className="mr-1"
            />
            <p className="text-color-neutral-40 font-sans text-sm font-normal leading-[150%] tracking-[-0.56px]">
              입장료
            </p>
            <p className="text-color-neutral-20 ml-auto font-sans text-sm font-normal leading-[150%] tracking-[-0.56px]">
              인당 {formatWithComma(information.reservationFee)} 원
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
