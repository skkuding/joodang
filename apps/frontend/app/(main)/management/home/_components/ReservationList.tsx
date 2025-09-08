"use client";

import { ReservationResponse } from "@/app/type";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ArrowDown from "@/public/icons/icon_arrow_down.svg";
import Image from "next/image";
import { useEffect, useState } from "react";

export function ReservationList() {
  const [reservation, setReservation] = useState<ReservationResponse | null>(
    null
  );
  useEffect(() => {}, []);

  return (
    <div className="flex flex-col space-y-[14px] px-5 pt-[30px]">
      <div className="text-color-common-0 justify-start text-xl font-medium leading-7">
        우리 주점을 예약했어요
      </div>
      <Accordion
        type="single"
        collapsible
        className="border-color-neutral-50 w-full rounded-md border px-[14px] text-sm"
      >
        <AccordionItem value="item-1">
          <AccordionTrigger className="flex h-[62px] items-center">
            <div className="flex w-full flex-row justify-between">
              <div className="flex flex-col">
                <p className="text-color-common-0 justify-start text-sm font-normal leading-tight">
                  모태솔로지만 연애 마려웡
                </p>
                <p className="justify-start text-xs font-normal leading-none text-[#FF5940]">
                  2025. 01. 01 ~ 2025. 01. 02
                </p>
              </div>
              <div className="flex items-center justify-center">
                <Image
                  src={ArrowDown}
                  alt="arrow down"
                  width={24}
                  height={24}
                />
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>첫 번째 아코디언 내용입니다.</AccordionContent>
        </AccordionItem>
      </Accordion>

      <div>{/* <ReservationListItem /> */}</div>
    </div>
  );
}
