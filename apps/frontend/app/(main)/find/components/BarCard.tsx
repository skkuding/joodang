"use client";

import { Store } from "@/app/type";
import { formatToHHMM, formatWithComma } from "@/lib/utils";
import Arrow from "@/public/icons/icon_arrow.svg";
import Location from "@/public/icons/icon_location.svg";
import Money from "@/public/icons/orangeMoney.svg";
import Image from "next/image";
import Link from "next/link";

interface BarCardProps {
  store: Store;
}

export default function BarCard({ store }: BarCardProps) {
  return (
    <Link href={`/${String(store.id)}`}>
      <div
        className="h-[284px] w-[335px] overflow-hidden rounded-[6px]"
        style={{ boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.12)" }}
      >
        <Image
          src={store.imageUrl}
          alt="Store Image"
          className="h-[110px] object-cover object-center"
          height={100}
          width={335}
        />

        <div className="px-5 pb-5 pt-[14px]">
          <div className="text-xs font-normal leading-[140%] tracking-[-0.36px] text-[#FF5940]">
            {store.organizer}
          </div>
          <div className="mb-3 flex h-[22px] flex-row justify-between">
            <div className="text-color-common-0 text-base font-medium leading-[140%] tracking-[-0.48px]">
              {store.name}
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
                {store.location}
              </p>
            </div>
            <div className="flex w-full flex-row items-center">
              <object data="/icons/icon_clock.png" className="mr-1 h-4 w-4" />
              <p className="text-color-neutral-40 font-sans text-sm font-normal leading-[150%] tracking-[-0.56px]">
                운영 시간
              </p>
              <p className="text-color-neutral-20 ml-auto font-sans text-sm font-normal leading-[150%] tracking-[-0.56px]">
                {formatToHHMM(store.startTime)} ~ {formatToHHMM(store.endTime)}
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
                인당 {formatWithComma(store.reservationFee)} 원
              </p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
