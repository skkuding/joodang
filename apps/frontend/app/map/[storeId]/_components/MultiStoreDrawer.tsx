"use client";

import { useSelectedStore } from "@/app/stores/useSelectedStore";
import type { Store } from "@/app/type";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
      className="fixed bottom-[-390px] left-0 right-0 z-[9999] mx-auto w-full rounded-t-2xl border bg-white"
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

      <div
        className="overflow-auto"
        onTouchStart={e => e.stopPropagation()}
        onTouchMove={e => e.stopPropagation()}
      >
        <ScrollArea className="overflow-auto" style={{ maxHeight: "30vh" }}>
          {stores.map(store => (
            <div
              key={store.id}
              className="mx-5 mb-2 cursor-pointer rounded-xl p-3 shadow-lg hover:bg-gray-100"
              onClick={() => setSelectedStoreId(store.id)}
            >
              <h3 className="text-primary-normal text-[13px] font-medium">
                {store.organizer}
              </h3>
              <div className="flex items-center justify-between">
                <p className="text-base font-medium">{store.name}</p>
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
              <div className="text-color-neutral-40 mt-2 flex gap-2 rounded-sm bg-[#F5F5F5] p-1 text-sm font-normal">
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
