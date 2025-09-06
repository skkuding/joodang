"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import type { StoreDetail } from "@/app/type";
import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatToHHMM } from "@/lib/utils";

interface StoreDrawerProps {
  store: StoreDetail;
}

export function StoreDrawer({ store }: StoreDrawerProps) {
  const [isOpen, setIsOpen] = useState(true); // 페이지 진입 시 기본으로 열려 있도록 true 설정
  const formattedStartTime = formatToHHMM(store.startTime);
  const formattedEndTime = formatToHHMM(store.endTime);

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerContent className="fixed bottom-0 left-0 right-0 flex h-[60%] flex-col rounded-t-[10px] bg-white">
        {/* Drawer.Handle은 접혔을 때도 보이도록 상단에 위치시키고 스타일을 조정합니다. */}
        {/* <div className="mx-auto w-full max-w-sm">
          <Drawer.Handle className="mx-auto mb-2 mt-3 h-2 w-[100px] rounded-full bg-gray-300" />
        </div> */}

        <div className="flex-1 overflow-y-auto bg-white p-4">
          <DrawerHeader className="px-0 pt-0">
            <h2 className="text-sm font-semibold text-gray-500">
              {store.college}
            </h2>
            <DrawerTitle className="mt-1 text-2xl font-bold">
              {store.name}
            </DrawerTitle>
            <DrawerDescription className="sr-only">
              {store.description}
            </DrawerDescription>
          </DrawerHeader>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Image
                src="/icons/icon_location.svg"
                alt="Location"
                width={16}
                height={16}
              />
              <span>위치</span>
            </div>
            <div className="text-right">{store.location}</div>

            <div className="flex items-center gap-2">
              <Image
                src="/icons/icon_time.svg"
                alt="Operating Hours"
                width={16}
                height={16}
              />
              <span>운영 시간</span>
            </div>
            <div className="text-right">
              {formattedStartTime} ~ {formattedEndTime}
            </div>

            <div className="flex items-center gap-2">
              <Image
                src="/icons/icon_ticket.svg"
                alt="Entrance Fee"
                width={16}
                height={16}
              />
              <span>입장료</span>
            </div>
            <div className="text-right">
              {store.reservationFee.toLocaleString()} 원
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-500">주점 연락처</h3>
            <div className="mt-2 flex items-center justify-between text-base">
              <span className="text-gray-800">010-1111-1111</span>
              <Button variant="link" className="h-auto p-0 text-orange-500">
                자세히 보기
              </Button>
            </div>
          </div>

          <DrawerFooter className="mt-8 p-0">
            <Button className="w-full rounded-lg bg-orange-500 py-3 text-lg font-semibold text-white">
              주점 상세 보기
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
