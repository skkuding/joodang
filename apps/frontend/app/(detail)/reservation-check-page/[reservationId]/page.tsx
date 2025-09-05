"use client";
import Location from "@/public/icons/icon_location.svg";
import Clock from "@/public/icons/orangeClock.svg";
import Money from "@/public/icons/orangeMoney.svg";
import OrangeDot from "@/public/icons/orange_dot.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DetailHeader } from "../../../components/DetailHeader";

export default function ReservationDetail() {
  const router = useRouter();
  const [isAccountModalVisible, setIsAccountModalVisible] =
    useState<boolean>(false);
  // const [account, setAccount] = useState<AccountData>({
  //   bank: "신한은행",
  //   accountNum: "000-0000-0000-00",
  //   owner: "방승현",
  // });

  return (
    <div className="bg-color-neutral-99 flex min-h-screen flex-col">
      {/* <CopyAccountModal store={store} /> */}
      <DetailHeader />
      <div className="mb-4" />

      {/* 윗 부분 */}
      <div className="bg-color-common-100 mb-[10px] p-5">
        <div>
          <p className="justify-start font-['Pretendard'] text-xs font-normal leading-none text-red-500">
            성균관대학교 | SKKUDING
          </p>
          <p className="mb-3 h-7 w-64 justify-start font-['Pretendard'] text-xl font-medium leading-7 text-black">
            모태솔로지만 연애는 하고 싶어
          </p>
        </div>
        <div className="text-color-neutral-40 justify-start space-y-1 font-['Pretendard'] text-sm font-normal leading-tight">
          <div className="flex">
            <Image
              src={Location}
              alt="위치"
              width={16}
              height={16}
              className="mr-1"
            />
            <div className="flex w-full justify-between">
              <p>위치</p>
              <p className="text-color-neutral-20">경영관 테라스</p>
            </div>
          </div>
          <div className="flex">
            <Image
              src={Clock}
              alt="시간"
              width={12}
              height={12}
              className="ml-[2px] mr-1"
            />
            <div className="flex w-full justify-between">
              <p>운영 시간</p>
              <p className="text-color-neutral-20">14:00 ~ 22:00</p>
            </div>
          </div>
          <div className="flex">
            <Image
              src={Money}
              alt="입장료"
              width={16}
              height={16}
              className="mr-1"
            />
            <div className="flex w-full justify-between">
              <p>입장료</p>
              <p className="text-color-neutral-20">인당 20,000원</p>
            </div>
          </div>
        </div>

        <div className="bg-color-neutral-99 mt-2 justify-start space-y-[6px] rounded-md px-4 py-3 font-['Pretendard'] text-sm font-normal leading-tight text-zinc-700">
          <div className="flex">
            <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
            <div className="ml-2 flex w-full justify-between">
              <p>주점 연락처</p>
              <p className="text-color-neutral-20">010-0000-0000</p>
            </div>
          </div>
          <div className="flex">
            <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
            <div className="ml-2 flex w-full justify-between">
              <p>입금 계좌</p>
              <p
                className="text-[#FF5940]"
                onClick={() => {
                  setIsAccountModalVisible(true);
                }}
              >
                <u>자세히 보기</u>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 아랫 부분 */}
      <div className="bg-color-common-100 flex flex-1 flex-col justify-start gap-6 px-5 pt-5 font-['Pretendard'] text-base font-normal leading-normal text-zinc-700">
        <div className="flex">
          <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
          <div className="ml-2 flex w-full justify-between">
            <p>날짜</p>
            <p className="text-color-common-0">2025년 01월 01일 (목)</p>
          </div>
        </div>
        <div className="flex">
          <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
          <div className="ml-2 flex w-full justify-between">
            <p>시간대</p>
            <p className="text-color-common-0">13:00 ~ 15:00</p>
          </div>
        </div>
        <div className="flex">
          <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
          <div className="ml-2 flex w-full justify-between">
            <p>총 인원</p>
            <p className="text-color-common-0">5명</p>
          </div>
        </div>
        {/* <div>
          <div className="mb-2 flex">
            <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
            <div className="ml-3 flex w-full justify-between">
              <p>메뉴 선예약</p>
            </div>
          </div>
          <div className="bg-color-neutral-99 w-full rounded-[6px] px-5 py-4">
            <div className="flex flex-col space-y-2 border-b pb-2">
              <div className="flex">
                <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
                <div className="ml-2 flex w-full justify-between">
                  <p>김치찌개</p>
                  <p>24,800원</p>
                </div>
              </div>
              <div className="flex">
                <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
                <div className="ml-2 flex w-full justify-between">
                  <p>먹태</p>
                  <p>16,000원</p>
                </div>
              </div>
            </div>
            <div className="flex flex-row-reverse">
              <p>총 40,800원</p>
            </div>
          </div>
        </div> */}
        <div className="mb-[40px] mt-[60px]">
          <button
            className="h-11 w-full rounded-xl bg-[#FF5940] text-sm font-medium text-white"
            onClick={() => {
              router.back();
            }}
          >
            예약 취소
          </button>
        </div>
      </div>
    </div>
  );
}
