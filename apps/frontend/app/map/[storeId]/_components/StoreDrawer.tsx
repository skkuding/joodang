"use client";

import type { StoreDetail } from "@/app/type";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { formatTimeToKST } from "@/lib/utils";
import { motion } from "framer-motion";

interface StoreDrawerProps {
  store: StoreDetail;
  mylocationfunc: () => void;
}

export function StoreDrawer({ store, mylocationfunc }: StoreDrawerProps) {
  const router = useRouter();
  const [height, setHeight] = useState(0.9);
  const formattedStartTime = formatTimeToKST(store.startTime);
  const formattedEndTime = formatTimeToKST(store.endTime);

  const expanded = 0.9;
  const collapsed = 0.5;

  const handleNavigatetoStoreDetail = (storeId: number) => {
    router.push(`/${storeId}`);
  };

  return (
    <motion.div
      className="fixed bottom-[-390px] left-0 right-0 z-50 mx-auto max-w-md rounded-t-2xl border bg-white shadow-lg"
      style={{ height: `${height * 100}vh` }}
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      onDragEnd={(_, info) => {
        const currentHeight = height;
        const threshold = (expanded + collapsed) / 2;

        // 드래그로 변경된 최종 위치 비율 계산
        const newHeight = currentHeight - info.offset.y / window.innerHeight;

        if (newHeight >= threshold) {
          setHeight(expanded);
        } else {
          setHeight(collapsed);
        }
      }}
      animate={{ height: `${height * 100}vh` }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <button
        onClick={mylocationfunc}
        className="absolute right-5 top-[-60px] flex h-[42px] w-[42px] justify-center rounded-full bg-[#4A4A4A] shadow-md"
      >
        <Image
          src="/icons/icon_my_location.svg"
          alt="My Location"
          width={26}
          height={26}
        />
      </button>
      {/* 핸들 */}
      <div className="mx-auto mb-[30px] mt-4 h-1 w-[100px] cursor-pointer rounded-full bg-gray-300" />

      {/* 콘텐츠 */}
      <div className="overflow-y-auto px-5">
        <h2 className="text-sm font-semibold text-[#FF5940]">
          {store.organizer}
        </h2>
        <h1 className="mt-1 text-xl font-medium">{store.name}</h1>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/icon_location.svg"
              alt="Location"
              width={18}
              height={18}
            />
            <span className="text-[#5C5C5C]">위치</span>
          </div>
          <div className="text-right">{store.location}</div>

          <div className="flex items-center gap-2">
            <Image
              src="/icons/icon_orange_clock.svg"
              alt="Operating Hours"
              width={14}
              height={14}
              className="ml-[2px]"
            />
            <span className="text-[#5C5C5C]">운영 시간</span>
          </div>
          <div className="text-right">
            {formattedStartTime} ~ {formattedEndTime}
          </div>

          <div className="flex items-center gap-2">
            <Image
              src="/icons/orangemoney.svg"
              alt="Entrance Fee"
              width={18}
              height={18}
            />
            <span className="text-[#5C5C5C]">입장료</span>
          </div>
          <div className="text-right">
            인당 {store.reservationFee.toLocaleString()} 원
          </div>
        </div>

        <div className="mt-2 rounded-md bg-[#F5F5F5] px-4 py-3">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Image
                src="/icons/orange_dot.svg"
                alt="Orange Dot"
                width={6}
                height={6}
              />
              <h3 className="text-sm">주점 연락처</h3>
            </div>
            <span className="text-sm text-gray-800">010-1111-1111</span>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Image
                src="/icons/orange_dot.svg"
                alt="Orange Dot"
                width={6}
                height={6}
              />
              <h3 className="text-sm">입금 계좌</h3>
            </div>
            <Button
              variant="link"
              className="h-auto p-0 text-sm text-orange-500"
            >
              자세히 보기
            </Button>
          </div>
        </div>
        <Button
          onClick={() => handleNavigatetoStoreDetail(store.id)}
          className="mt-10 w-full bg-[#FF5940] text-white hover:bg-[#e04e3a]"
        >
          주점 상세보기
        </Button>
      </div>
    </motion.div>
  );
}
