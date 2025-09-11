"use client";

import type { StoreDetail } from "@/app/type";
import { Button } from "@/components/ui/button";
import { formatTimeToKST } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CopyAccountModal from "@/app/components/CopyAccountModal";

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
  const collapsed = 0.6;

  const handleNavigatetoStoreDetail = (storeId: number) => {
    router.push(`/${storeId}`);
  };

  return (
    <motion.div
      className="fixed bottom-[-390px] left-0 right-0 z-[9999] mx-auto w-full rounded-t-2xl border bg-white shadow-lg"
      style={{ height: `${height * 100}vh`, touchAction: "none" }}
      animate={{ height: `${height * 100}vh` }}
      transition={{
        duration: 0.3, // 애니메이션 시간 (0.4초)
        ease: "easeOut", // 부드러운 감속 효과
      }}
      onTouchMove={e => e.stopPropagation()}
      onWheel={e => e.stopPropagation()}
    >
      <button
        onClick={mylocationfunc}
        className="absolute right-5 top-[-60px] flex h-[42px] w-[42px] content-center justify-center rounded-full bg-[#4A4A4A] shadow-md"
      >
        <Image
          src="/icons/icon_my_location.svg"
          alt="My Location"
          width={26}
          height={26}
          className="m-2"
        />
      </button>
      {/* 핸들 */}
      <motion.div
        className="mb-4 mt-3 flex h-2 w-full cursor-pointer items-center justify-center"
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.03}
        onDragEnd={(_, info) => {
          if (info.offset.y < 0) {
            setHeight(expanded);
          } else {
            setHeight(collapsed);
          }
        }}
      >
        <div>
          <div className="mx-auto h-1 w-[100px] cursor-pointer rounded-full bg-gray-300" />
        </div>
      </motion.div>
      {/* 콘텐츠 */}
      <div className="overflow-y-auto px-5">
        <h2 className="text-sm font-semibold text-[#FF5940]">
          {store.organizer}
        </h2>
        <h1 className="mt-1 text-xl font-medium">{store.name}</h1>
        <div className="mt-4 grid grid-cols-2 gap-1 text-sm">
          <div className="flex items-center gap-2">
            <Image
              src="/icons/icon_location.svg"
              alt="Location"
              width={16}
              height={16}
            />
            <span className="text-[#5C5C5C]">위치</span>
          </div>
          <div className="text-right">{store.location}</div>

          <div className="flex items-center gap-2">
            <object data="/icons/icon_clock.png" className="h-4 w-4" />
            <span className="text-[#5C5C5C]">운영 시간</span>
          </div>
          <div className="text-right">
            {formattedStartTime} ~ {formattedEndTime}
          </div>

          <div className="flex items-center gap-2">
            <Image
              src="/icons/orangeMoney.svg"
              alt="Entrance Fee"
              width={16}
              height={16}
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
            <span className="text-sm text-gray-800">{store.contactInfo}</span>
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
            <div className="z-9999">
              <CopyAccountModal store={store} />
            </div>
          </div>
        </div>
        <Button
          onClick={() => handleNavigatetoStoreDetail(store.id)}
          className="mt-9 w-full bg-[#FF5940] text-white hover:bg-[#e04e3a]"
        >
          주점 상세보기
        </Button>
      </div>
    </motion.div>
  );
}
