import Image from "next/image";
import type { Notification, StoreDetail } from "../../type";
import Link from "next/link";
import { safeFetcher } from "@/lib/utils";

interface NotiCardProps {
  noti: Notification;
}
export default async function NotiCard({ noti }: NotiCardProps) {
  let storeData: StoreDetail | null = null;
  if (noti.storeId !== null) {
    storeData = (await safeFetcher
      .get(`store/${noti.storeId}`)
      .json()) as StoreDetail;
    console.log("storeData", storeData);
  }
  return (
    <div
      key={noti.id}
      className="w-[335px] rounded-2xl border-0 bg-white p-4 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/icons/icon_orange_noti.svg"
            alt="Notification Icon"
            width={24}
            height={24}
          />
          <h2 className="max-w-[200px] break-keep text-base font-semibold text-red-500">
            {noti.message}
          </h2>
        </div>
        <Link href={noti.url} passHref>
          <button className="flex text-xs text-gray-500 hover:underline">
            <p>상세보기 </p>
            <Image src="/icons/icon_arrow.svg" alt=">" width={14} height={14} />
          </button>
        </Link>
      </div>

      {noti.type === "ReservationReminder" ? (
        <div className="mt-2 flex flex-col gap-2 whitespace-pre-line rounded-md bg-[#f5f5f5] p-2 text-sm text-gray-700">
          <div className="flex justify-between">
            <div className="flex gap-1">
              <Image
                src="icons/icon_gray_coloredHouse.svg"
                alt="Store Icon"
                width={16}
                height={16}
                className="mr-1 inline-block"
              />
              <p>주점명</p>
            </div>
            <p>{storeData?.name}</p>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-1">
              <Image
                src="icons/icon_gray_location.svg"
                alt="Location Icon"
                width={16}
                height={16}
                className="mr-1 inline-block"
              />
              <p>위치</p>
            </div>
            <p>{storeData?.location}</p>
          </div>
        </div>
      ) : noti.message === "오래 기다리셨습니다. 지금 방문해주세요!" ? (
        <p className="mt-2 text-sm text-gray-700">
          5분 이내로 {storeData?.name}에 방문해주세요.
        </p>
      ) : (
        ""
      )}
    </div>
  );
}
