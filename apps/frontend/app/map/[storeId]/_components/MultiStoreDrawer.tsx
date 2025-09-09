"use client";

import type { Store } from "@/app/type";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelectedStore } from "@/app/stores/useSelectedStore";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StoreDrawerProps {
  stores: Store[];
  mylocationfunc: () => void;
}

export function MultiStoreDrawer({ stores, mylocationfunc }: StoreDrawerProps) {
  const setSelectedStoreId = useSelectedStore(
    state => state.setSelectedStoreId
  );

  const router = useRouter();
  const [height, setHeight] = useState(0.9);
  //   const formattedStartTime = formatTimeToKST(store.startTime);
  //   const formattedEndTime = formatTimeToKST(store.endTime);

  const expanded = 0.9;
  const collapsed = 0.6;

  const handleNavigatetoStoreDetail = (storeId: number) => {
    router.push(`/map/${storeId}`);
  };

  return (
    <motion.div
      className="fixed bottom-[-390px] left-0 right-0 z-50 mx-auto w-full rounded-t-2xl border bg-white shadow-lg"
      style={{ height: `${height * 100}vh`, touchAction: "none" }}
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
      <div className="mx-auto mb-[30px] mt-4 h-1 w-[100px] cursor-pointer rounded-full bg-gray-300" />

      {/* 콘텐츠 */}

      <div
        className="overflow-auto p-4"
        onTouchStart={e => e.stopPropagation()}
        onTouchMove={e => e.stopPropagation()}
      >
        <ScrollArea className="overflow-auto" style={{ maxHeight: "35vh" }}>
          {stores.map(store => (
            <div
              key={store.id}
              className="mb-2 cursor-pointer rounded-xl p-3 shadow-md hover:bg-gray-100"
              onClick={() => setSelectedStoreId(store.id)}
            >
              <h3 className="text-[13px] text-[#FF5940]">{store.organizer}</h3>
              <div className="flex items-center justify-between">
                <p className="text-md">{store.name}</p>
                <button
                  onClick={() => handleNavigatetoStoreDetail(store.id)}
                  className="flex text-xs text-gray-500 hover:underline"
                >
                  <p>상세보기 </p>
                  <Image
                    src="/icons/icon_arrow.svg"
                    alt=">"
                    width={14}
                    height={14}
                  />
                </button>
              </div>
              <div className="text-[#5C5C5C mt-2 flex gap-2 rounded-sm bg-[#F5F5F5] p-1 text-sm">
                <Image
                  src="/icons/icon_gray_location.svg"
                  alt="Location"
                  width={14}
                  height={14}
                  className="mt-[2px]"
                />
                <p>{store.location}</p>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>
    </motion.div>
  );
}
