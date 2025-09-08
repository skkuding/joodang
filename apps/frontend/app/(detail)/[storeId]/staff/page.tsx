"use client";
import { Separator } from "@/app/(main)/components/Separator";
import { RoleEnum, StoreDetail } from "@/app/type";
import { safeFetcher } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { StoreInfoHeader } from "../../components/StoreInfo";

export default function Page() {
  const { storeId } = useParams();
  const [role, setRole] = useState<RoleEnum | null>(null);
  const [store, setStore] = useState<StoreDetail | null>(null);
  const [staffCount, setStaffCount] = useState<number | null>(null);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response: { role: string } = await safeFetcher
          .get("user/me/role")
          .json();
        console.log(response);
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

  useEffect(() => {
    const fetchStore = async () => {
      const store: StoreDetail = await safeFetcher
        .get(`store/${storeId}`)
        .json();
      setStore(store);
    };

    fetchStore();
  }, [storeId]);

  if (role !== RoleEnum.OWNER) {
    return;
  }

  return (
    <div>
      <div className="flex flex-col justify-center p-5">
        {store && <StoreInfoHeader store={store} />}
      </div>
      <Separator />
      <div className="p-5">
        <div className="flex items-center gap-2 text-base font-medium">
          <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
          현재 추가된 스탭
        </div>
        <span className="text-color-neutral-50 ml-3 text-xs font-normal">
          스탭은 최대 10명 까지만 추가할 수 있어요
        </span>
      </div>
    </div>
  );
}
