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

interface StaffsResult {
  user: User;
}

export function StoreActionButtons({ store }: StoreActionButtonsProps) {
  const [user, setUser] = useState<User | null>(null);
  const [staffIds, setStaffIds] = useState<number[]>([]);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user: User = await safeFetcher.get("user/me").json();
        setUser(user);
        console.log(user);
      } catch {}
    };

    const fetchStaffs = async () => {
      try {
        const staffs: StaffsResult[] = await safeFetcher
          .get(`store/${store.id}/staff`)
          .json();
        setStaffIds(staffs.map(staff => staff.user.id));
        console.log(staffIds);
      } catch {}
    };

    fetchUser();
    fetchStaffs();
  }, []);

  // TODO: staff계정으로 로그인시 버튼이 잘 나오는지 확인
  return (
    <div className="mt-[-18px] w-full px-5 pb-[22px]">
      {user && staffIds.includes(user.id) ? (
        <div className="flex gap-[6px]">
          {store.ownerId === user.id && (
            <Link href={"" + store.id + "/staff"}>
              <Button className="w-full">스탭 관리하기</Button>
            </Link>
          )}
          <Link href={`/edit-store/${store.id}`}>
            <Button
              className="w-full"
              variant={store.ownerId === user.id ? "outline" : undefined}
            >
              내용 수정하기
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex gap-[6px]">
          <Link href={`/${store.id}/reservation`} className="flex-1">
            <Button className="w-full">예약하기</Button>
          </Link>
          <div className="flex-1">
            <StandByButton />
          </div>
        </div>
      )}
    </div>
  );
}
