"use client";
import { Store } from "@/app/type";
import { safeFetcher } from "@/lib/utils";
import { CarouselApi } from "@/ui/carousel";
import { useCallback, useEffect, useState } from "react";
import { Banner } from "./_components/Banner";
import { ReservationList } from "./_components/ReservationList";
import { Separator } from "./_components/Separator";
import { StoreList } from "./_components/StoreList";

export default function Home() {
  const [api, setApi] = useState<CarouselApi>();
  const [stores, setStores] = useState<Store[]>([]);
  const [current, setCurrent] = useState<number>(0);

  const fetchStores = useCallback(async () => {
    const stores: Store[] = await safeFetcher("store").json();
    setStores(stores.slice(0, 8));
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    fetchStores();
    const inviteCode = localStorage.getItem("inviteCode");
    if (inviteCode) {
      // inviteCode를 사용한 로직 실행
      console.log("Saved invite code:", inviteCode);

      // 사용 후 제거 (선택사항)
      localStorage.removeItem("inviteCode");
    }
  }, []);

  return (
    <div className="flex flex-col">
      <Banner />
      <Separator />
      <StoreList />
      <Separator />
      <ReservationList />
    </div>
  );
}
