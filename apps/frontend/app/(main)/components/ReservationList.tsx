"use client";

import { ReservationResponse } from "@/app/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

export function ReservationList() {
  const [reservation, setReservation] = useState<ReservationResponse | null>(
    null
  );
  useEffect(() => {
    async function getStoreReservations() {
      // const
    }
  }, []);

  return (
    <div className="flex flex-col space-y-[14px] px-5 pt-[30px]">
      <div className="text-color-common-0 justify-start text-xl font-medium leading-7">
        우리 주점을 예약했어요
      </div>
      <div className="w-full rounded-md text-sm">
        <Select defaultValue="item-1">
          <SelectTrigger className="flex h-[62px] w-full items-center">
            <SelectValue placeholder="예약을 선택하세요" />
          </SelectTrigger>
          <SelectContent className="w-full">
            <SelectItem value="item-1" className="py-2">
              <div className="flex flex-col">
                <p className="text-color-common-0 justify-start text-sm font-normal leading-tight">
                  모태솔로지만 연애 마려웡
                </p>
                <p className="justify-start text-xs font-normal leading-none text-[#FF5940]">
                  2025. 01. 01 ~ 2025. 01. 02
                </p>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>{/* <ReservationListItem /> */}</div>
    </div>
  );
}
