"use client";
import { useCallback, useEffect, useState } from "react";
import { safeFetcher } from "../../lib/utils";
import { CarouselApi } from "../../ui/carousel";
import { RoleEnum, Store } from "../type";
import { Banner } from "./components/Banner";
import { MyStoreList } from "./components/MyStoreList";
import { ReservationList } from "./components/ReservationList";
import { Separator } from "./components/Separator";
import { StoreList } from "./components/StoreList";
import { StoreLocation } from "./components/StoreLocation";

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

  const [role, setRole] = useState<RoleEnum | null>(null);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response: { role: string } = await safeFetcher
          .get("user/me/role")
          .json();
        if (response.role === RoleEnum.USER) {
          setRole(RoleEnum.USER);
        } else if (response.role === RoleEnum.STAFF) {
          setRole(RoleEnum.STAFF);
        } else if (response.role === RoleEnum.OWNER) {
          setRole(RoleEnum.OWNER);
        } else if (response.role === RoleEnum.ADMIN) {
          setRole(RoleEnum.ADMIN);
        }
      } catch {}
    };

    checkAuth();
  }, []);

  return (
    <div>
      {role === RoleEnum.STAFF ||
      role === RoleEnum.OWNER ||
      role === RoleEnum.ADMIN ? ( // 근데 어드민도 여기 넣어야하나 ㅇㅅㅇ...
        <div className="flex flex-col">
          <Banner />
          <Separator />
          <MyStoreList />
          <Separator />
          <ReservationList />
        </div>
      ) : (
        <div className="flex flex-col">
          <Banner />
          <Separator />
          <StoreList />
          <Separator />
          <StoreLocation />
        </div>
      )}
    </div>
  );
}
