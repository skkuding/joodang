import { Store } from "@/app/type";
import clockIcon from "@/assets/icon_clock.svg";
import locationIcon from "@/assets/icon_location.svg";
import moneyIcon from "@/assets/icon_money.svg";
import { dateFormatter } from "@/lib/utils";
import Image from "next/image";

interface senderStoreSummaryProps {
  store: Store;
}

export function renderStoreSummary({ store }: senderStoreSummaryProps) {
  return (
    <div className="p-5 pb-[30px] bg-white">
      <h2 className="text-xs font-normal text-primary-normal ">{store.name}</h2>
      <p className="text-xl font-medium mb-3">{store.description}</p>
      <div className="text-sm font-normal flex flex-col gap-1">
        <div className="flex justify-between">
          <div className="flex gap-1 items-center">
            <Image src={locationIcon} alt="Location" className="w-4 h-4" />
            <span>위치</span>
          </div>
          <span>{store.name}</span>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-1 items-center">
            <Image src={clockIcon} alt="Clock" className="w-4 h-3" />
            <span>운영 시간</span>
          </div>
          <span>
            {dateFormatter(store.startTime, "HH:mm")} ~{" "}
            {dateFormatter(store.endTime, "HH:mm")}
          </span>
        </div>
        <div className="flex justify-between mb-3">
          <div className="flex gap-1 items-center">
            <Image src={moneyIcon} alt="Money" className="w-4 h-4" />
            <span>입장료</span>
          </div>
          <span>인당 {store.reservationFee}</span>
        </div>
        <div className="flex rounded-md justify-between px-4 py-3 bg-color-neutral-99 text-base font-normal ">
          <div className="flex gap-2 items-center">
            <div className="rounded-full bg-primary-normal w-1.5 h-1.5" />
            <span>현재 예약 가능한 인원</span>
          </div>
          <span className="text-primary-normal">13명</span>
        </div>
      </div>
    </div>
  );
}
