"use client";
import CopyAccountModal from "@/app/components/CopyAccountModal";
import { Button } from "@/components/ui/button";
import locationIcon from "@/public/icons/icon_location.svg";
import moneyIcon from "@/public/icons/icon_money.svg";
import Image from "next/image";
import { toast } from "sonner";
import { dateFormatter, formatWithComma } from "../../../lib/utils";
import { StoreDetail } from "../../type";

interface senderStoreSummaryProps {
  store: StoreDetail;
}

export function StoreInfo({ store }: senderStoreSummaryProps) {
  const handleCopyPhone = async () => {
    toast.dismiss();
    try {
      await navigator.clipboard.writeText(store.contactInfo);
      toast.success("연락처가 복사되었습니다", {
        id: "copy-toast",
      });
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  return (
    <div className="p-5 pb-[30px]">
      <StoreInfoHeader store={store} />
      <div className="mb-3 flex flex-col gap-1 text-sm font-normal">
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <Image src={locationIcon} alt="Location" className="h-4 w-4" />
            <span>위치</span>
          </div>
          <span>{store.location}</span>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <object data="/icons/icon_clock.png" className="h-4 w-4" />
            <span>운영 시간</span>
          </div>
          <span>
            {dateFormatter(store.startTime, "HH:mm")} ~{" "}
            {dateFormatter(store.endTime, "HH:mm")}
          </span>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-1">
            <Image src={moneyIcon} alt="Money" className="h-4 w-4" />
            <span>입장료</span>
          </div>
          <span>인당 {formatWithComma(store.reservationFee)} 원</span>
        </div>
      </div>
      <div className="bg-color-neutral-99 flex flex-col gap-[6px] rounded-md px-4 py-3 text-sm font-normal">
        <div className="flex w-full justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
            <span>주점 연락처</span>
          </div>
          <Button
            onClick={handleCopyPhone}
            variant="ghost"
            className="h-6 w-fit"
          >
            <span className="text-sm font-normal">{store.contactInfo}</span>
          </Button>
        </div>
        <div className="flex w-full justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
            <span>입금 계좌</span>
          </div>
          <CopyAccountModal store={store} />
        </div>
      </div>
    </div>
  );
}

interface StoreInfoHeaderProps {
  store: Pick<StoreDetail, "college" | "organizer" | "name">;
}

export function StoreInfoHeader({ store }: StoreInfoHeaderProps) {
  return (
    <>
      <span className="text-primary-normal text-xs font-normal">
        {store.college}
        {" | "}
        {store.organizer}
      </span>
      <p className="mb-3 truncate text-xl font-medium">{store.name}</p>
    </>
  );
}
