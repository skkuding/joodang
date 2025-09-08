"use client";
import { Store, User } from "@/app/type";
import { Button } from "@/components/ui/button";
import { safeFetcher } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { StandByButton } from "./StandByButton";

interface StoreActionButtonsProps {
  store: Store;
}

export function StoreActionButtons({ store }: StoreActionButtonsProps) {
  const [user, setUser] = useState<User | null>(null);
  const [staffIds, setStaffIds] = useState<number[]>([]);
  useEffect(() => {
    const fetchUser = async () => {
      const user: User = await safeFetcher.get("user/me").json();
      setUser(user);
    };

    const fetchStaffs = async () => {
      const staffs: User[] = await safeFetcher
        .get(`store/${store.id}/staff`)
        .json();
      setStaffIds(staffs.map(staff => staff.id));
      console.log(staffIds);
    };

    fetchUser();
    fetchStaffs();
  }, []);

  // TODO: staff계정으로 로그인시 버튼이 잘 나오는지 확인
  return (
    <div className="pb-15 fixed bottom-0 left-0 right-0 p-5">
      {user && (store.ownerId === user.id || staffIds.includes(user.id)) ? (
        <div className="flex flex-col gap-[6px]">
          {store.ownerId === user.id && (
            <Link href={"" + store.id + "/staff"}>
              <Button className="w-full">스탭 관리하기</Button>
            </Link>
          )}
          <Link href={`/edit-store/${store.id}`}>
            <Button className="w-full" variant={"outline"}>
              내용 수정하기
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-[6px]">
          <Link href={`/${store.id}/reservation`}>
            <Button className="w-full">예약하기</Button>
          </Link>
          <StandByButton />
        </div>
      )}
    </div>
  );
}
