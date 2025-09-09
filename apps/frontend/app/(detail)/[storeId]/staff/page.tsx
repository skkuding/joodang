"use client";
import { Separator } from "@/app/(main)/components/Separator";
import { EmptyRecord } from "@/app/components/EmptyRecord";
import { RoleEnum, StoreDetail } from "@/app/type";
import { safeFetcher } from "@/lib/utils";
import { Button } from "@/ui/button";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { StoreInfoHeader } from "../../components/StoreInfo";
import { DeleteStaffButton } from "./components/DeleteStaffButton";

interface Staff {
  user: {
    id: number;
    kakaoId: string;
    name: string;
  };
}

export default function Page() {
  const { storeId } = useParams();
  const [role, setRole] = useState<RoleEnum | null>(null);
  const [store, setStore] = useState<StoreDetail | null>(null);
  const [staffs, setStaffs] = useState<Staff[]>([]);

  const fetchStaffs = useCallback(async () => {
    if (!storeId) return;
    try {
      const staffs: Staff[] = await safeFetcher
        .get(`store/${storeId}/staff`)
        .json();
      setStaffs(staffs);
      console.log(staffs);
    } catch (error) {
      console.error("Failed to fetch staffs:", error);
    }
  }, [storeId]);
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
    fetchStaffs();
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

  function StaffList() {
    if (!storeId) {
      return;
    }
    return (
      <div className="flex flex-col gap-3 p-5">
        <div className="flex justify-between text-base font-normal">
          <div className="flex items-center gap-2">
            <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
            <span> 현재 추가된 스탭</span>
          </div>
          <span> {staffs.length} 명</span>
        </div>
        <div className="border-color-neutral-95 flex flex-col rounded-md border">
          {staffs.length === 0 ? (
            <div className="flex min-h-[128px] items-center justify-center">
              <EmptyRecord description="현재 추가된 스탭이 없어요" />
            </div>
          ) : (
            staffs.map(staff => (
              <div
                className="flex w-full items-center justify-between px-4 py-[10px] text-sm font-normal"
                key={staff.user.id}
              >
                {staff.user.name}
                <DeleteStaffButton
                  storeId={storeId.toString()}
                  staffId={staff.user.id}
                  onDelete={fetchStaffs}
                />
              </div>
            ))
          )}
        </div>
      </div>
    );
  }

  interface InvitationResponse {
    message: string;
    invitationLink: string;
    inviteCode: string;
    expiresAt: string;
  }

  function AddStaffButton() {
    const handleAddStaff = async () => {
      try {
        const response: InvitationResponse = await safeFetcher
          .post(`store/${storeId}/staff/invitation`)
          .json();

        const shareData = {
          title: "Joodang",
          text: "주당에서 스탭으로 초대합니다",
          url: `https://joodang.com/invite-staff?storeId=${storeId}&inviteCode=${response.inviteCode}`,
        };

        await navigator.share(shareData);
      } catch (error) {
        console.error("Error sharing:", error);
      }
    };

    return (
      <div className="pb-15 fixed bottom-0 left-0 right-0 p-5">
        <Button className="w-full" onClick={handleAddStaff}>
          스탭 추가하기
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col justify-center p-5">
        {store && <StoreInfoHeader store={store} />}
      </div>
      <Separator />
      <StaffList />
      <AddStaffButton />
    </div>
  );
}
