"use client";

import BarCard from "@/app/(main)/find/components/BarCard";
import { Store, User } from "@/app/type";
import { safeFetcher } from "@/lib/utils";
import cautionIcon from "@/public/icons/icon_gray_caution.svg";
import Image from "next/image";
import { useEffect, useState } from "react";

export function MyStore() {
  const [stores, setStores] = useState<Store[] | null>(null);
  useEffect(() => {
    const fetchStore = async () => {
      const user: User = await safeFetcher.get("user/me").json();

      const stores: Store[] = await safeFetcher.get("store").json();
      setStores(stores.filter(store => store.ownerId === user.id));
    };

    fetchStore();
  }, []);

  return (
    <div className="p-5">
      <p className="mb-3 text-lg font-medium">내 주점 기록</p>
      <div className="flex justify-center py-[30px]">
        {(stores?.length ?? 0) === 0 ? (
          <div className="flex flex-col items-center gap-1">
            <Image src={cautionIcon} alt="caution" />
            <p className="text-color-neutral-70 text-sm font-medium">
              등록된 주점 기록이 없어요
            </p>
          </div>
        ) : (
          stores?.map(store => <BarCard key={store.id} store={store} />)
        )}
      </div>
    </div>
  );
}
