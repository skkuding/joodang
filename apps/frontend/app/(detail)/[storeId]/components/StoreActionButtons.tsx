"use client";
import { RoleEnum, User } from "@/app/type";
import { Button } from "@/components/ui/button";
import { safeFetcher } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { StandByButton } from "./StandByButton";

interface StoreActionButtonsProps {
  storeId: number;
}

export function StoreActionButtons({ storeId }: StoreActionButtonsProps) {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const user: User = await safeFetcher.get("user/me").json();
      setUser(user);
    };

    fetchUser();
  }, []);
  return (
    <div className="pb-15 fixed bottom-0 left-0 right-0 p-5">
      {user?.role === RoleEnum.ADMIN ? (
        <div className="flex flex-col gap-[6px]">
          <Link href={"" + storeId + "/staff"}>
            <Button className="w-full">스탭 추가하기</Button>
          </Link>
          <Link href={`/${storeId}/reservation`}>
            <Button className="w-full" variant={"outline"}>
              내용 수정하기
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-[6px]">
          <Link href={`/${storeId}/reservation`}>
            <Button className="w-full">예약하기</Button>
          </Link>
          <StandByButton />
        </div>
      )}
    </div>
  );
}
