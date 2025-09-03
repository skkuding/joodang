"use client";

import Arrow from "@/public/icons/icon_arrow.svg";
import Location from "@/public/icons/icon_location.svg";
import Calendar from "@/public/icons/orangeCalendar.svg";
import Clock from "@/public/icons/orangeClock.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ReservationCard() {
  // const store: Store = await safeFetcher.get("store").json();
  const router = useRouter();
  return (
    <div
      className="w-[335px]  h-[174px] rounded-[6px] overflow-hidden"
      style={{ boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.12)" }}
      onClick={() => {
        router.push("/reservation-check-page/1");
      }}
    >
      <div className="px-5 pb-5 pt-[14px]">
        <div
          className="text-[#FF5940]
           text-xs
           font-normal
           leading-[140%]
           tracking-[-0.36px]
           mb-[2px]"
        >
          성균관대학교
        </div>
        <div className="h-[22px] mb-3 flex flex-row justify-between">
          <div
            className="text-color-common-0
            text-base
            font-medium
            leading-[140%]
            tracking-[-0.48px]
            "
          >
            모태솔로지만 연애는 하고싶어
          </div>
          <Image src={Arrow} alt="화살표" width={18} height={18} />
        </div>
        <div className="flex flex-col p-2 justify-center items-start gap-1 self-stretch rounded-[6px] bg-color-neutral-99 w-[295px] h-[87px]">
          <div className="flex flex-row  w-full items-center">
            <Image
              src={Calendar}
              alt="날짜"
              width={16}
              height={16}
              className="mr-1"
            />
            <p
              className="text-color-neutral-40
                font-sans
                text-sm
                font-normal
                leading-[150%]
                tracking-[-0.56px]
                  "
            >
              날짜
            </p>
            <p
              className="text-color-neutral-20
                font-sans
                text-sm
                font-normal
                leading-[150%]
                tracking-[-0.56px]
                ml-auto"
            >
              경영관 테라스
            </p>
          </div>
          <div className="flex flex-row  w-full items-center">
            <Image
              src={Clock}
              alt="시간"
              width={12}
              height={12}
              className="mr-1 ml-[2px]"
            />
            <p
              className="text-color-neutral-40
                font-sans
                text-sm
                font-normal
                leading-[150%]
                tracking-[-0.56px]
                  "
            >
              예약 시간
            </p>
            <p
              className="text-color-neutral-20
                font-sans
                text-sm
                font-normal
                leading-[150%]
                tracking-[-0.56px]
                ml-auto"
            >
              14:00 ~ 22:00
            </p>
          </div>
          <div className="flex flex-row  w-full items-center">
            <Image
              src={Location}
              alt="돈"
              width={16}
              height={16}
              className="mr-1"
            />
            <p
              className="text-color-neutral-40
                font-sans
                text-sm
                font-normal
                leading-[150%]
                tracking-[-0.56px]
                  "
            >
              위치
            </p>
            <p
              className="text-color-neutral-20
                font-sans
                text-sm
                font-normal
                leading-[150%]
                tracking-[-0.56px]
                ml-auto"
            >
              인당 20,000 원
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
