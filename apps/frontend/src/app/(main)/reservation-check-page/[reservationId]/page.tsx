"use client";
import { DetailHeader } from "@/app/components/DetailHeader";
import Location from "@/icons/icon_location.svg";
import Clock from "@/icons/orangeClock.svg";
import Money from "@/icons/orangeMoney.svg";
import OrangeDot from "@/icons/orange_dot.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ReservationDetail() {
  const router = useRouter();
  return (
    <div className="flex flex-col min-h-screen">
      <DetailHeader />
      <div className="h-[144px] bg-color-common-100 pt-5 mb-[10px]">
        <div>
          <p>성균관대학교 | SKKUDING</p>
          <p>모태솔로지만 연애는 하고 싶어</p>
        </div>
        <div>
          <div className="flex">
            <Image src={Location} alt="위치" width={16} height={16} />
            <div className="flex justify-between w-full">
              <p>위치</p>
              <p>경영관 테라스</p>
            </div>
          </div>
          <div className="flex">
            <Image src={Clock} alt="시간" width={12} height={12} />
            <div className="flex justify-between w-full">
              <p>운영 시간</p>
              <p>14:00 ~ 22:00</p>
            </div>
          </div>
          <div className="flex">
            <Image src={Money} alt="입장료" width={16} height={16} />
            <div className="flex justify-between w-full">
              <p>입장료</p>
              <p>인당 20,000원</p>
            </div>
          </div>
        </div>
      </div>
      <div className="px-5 py-5 flex flex-col gap-6 flex-1 bg-color-common-100">
        <div className="flex">
          <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
          <div className="ml-2 flex justify-between w-full">
            <p>날짜</p>
            <p>2025년 01월 01일 (목)</p>
          </div>
        </div>
        <div className="flex">
          <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
          <div className="ml-2 flex justify-between w-full">
            <p>시간대</p>
            <p>13:00 ~ 15:00</p>
          </div>
        </div>
        <div className="flex">
          <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
          <div className="ml-2 flex justify-between w-full">
            <p>총 인원</p>
            <p>5명</p>
          </div>
        </div>
        <div>
          <div className="flex mb-2">
            <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
            <div className="ml-3 flex justify-between w-full">
              <p>메뉴 선예약</p>
            </div>
          </div>
          <div className="w-full bg-color-neutral-99 px-5 py-4 rounded-[6px]">
            <div className="border-b flex flex-col space-y-2 pb-2">
              <div className="flex">
                <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
                <div className="ml-2 flex justify-between w-full">
                  <p>김치찌개</p>
                  <p>24,800원</p>
                </div>
              </div>
              <div className="flex">
                <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
                <div className="ml-2 flex justify-between w-full">
                  <p>먹태</p>
                  <p>16,000원</p>
                </div>
              </div>
            </div>
            <div className="flex flex-row-reverse">
              <p>총 40,800원</p>
            </div>
          </div>
        </div>
        <div className="mt-[60px] mb-[60px]">
          <button
            className="h-11 w-full rounded-xl bg-[#FF5940] text-white text-sm font-medium"
            onClick={() => {
              router.back();
            }}
          >
            이전으로
          </button>
        </div>
      </div>
    </div>
  );
}
