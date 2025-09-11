"use client";

import BarCard from "@/app/(main)/find/components/BarCard";
import { EmptyRecord } from "@/app/components/EmptyRecord";
import { Store, User } from "@/app/type";
import { safeFetcher } from "@/lib/utils";

import { useEffect, useState } from "react";

export function MyStore() {
  const [stores, setStores] = useState<Store[] | null>(null);
  useEffect(() => {
    const fetchStore = async () => {
      const myStores: Store[] = await safeFetcher.get("store?sort=my").json();
      setStores(myStores);
    };

    fetchStore();
  }, []);

  return (
    <div className="p-5">
      <p className="mb-3 text-lg font-medium">내 주점 기록</p>
      <div className="flex flex-col justify-center gap-2">
        {(stores?.length ?? 0) === 0 ? (
          <EmptyRecord description="등록된 주점 기록이 없어요" />
        ) : (
          stores?.map(store => <BarCard key={store.id} store={store} />)
        )}
      </div>
    </div>
  );
}
