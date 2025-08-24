"use client";

import smallLoc from "@/icons/icon_location copy.svg";
import IconLocation from "@/icons/icon_location.svg";
import OrangeDot from "@/icons/orange_dot.svg";
import Image from "next/image";
import { useState } from "react";
import BarCard from "./components/BarCard";
import FilterSetting from "./components/FilterSetting";

export default function BarPage() {
  const arr = [1, 2, 3];
  const [isFilterSet, SetIsFilterSet] = useState(false);
  const [selOrder, SetSelOrder] = useState("popular");

  const [open, setOpen] = useState(true);

  return (
    <div className="mt-[30px] ">
      <div className="p-5">
        <FilterSetting open={open} onClose={() => setOpen(false)} />
        <div>
          <Image src={IconLocation} alt="주황위치" width={24} height={24} />
          <div className="flex flex-row justify-between">
            <div className="text-color-common-0 text-xl font-sans leading-[140%] font-medium tracking-[-0.6px] mt-1">
              주점을 찾아볼까요?
            </div>
            <button className="w-[95px] h-[25px] bg-[#FF594014] flex flex-row justify-item item-center rounded-1 px-2 py-1">
              <Image src={smallLoc} alt="지도버튼" width={12} height={12} />
              <p
                className="text-[#FF5940]
                font-sans
                text-xs
                font-normal
                leading-[140%]
                tracking-[-0.36px]"
              >
                지도에서 찾기
              </p>
            </button>
          </div>

          <div
            className="text-color-neutral-40
            font-sans
            text-[14px]
            font-normal
            leading-[150%]
            tracking-[-0.42px]
            mt-3
            mb-5"
          >
            <p>필터를 설정하면 알맞는 주점을</p>
            <p>주당이 찾아드려요!</p>
          </div>
        </div>
        <div
          className="h-[149px] w-full bg-color-common-100 p-5 rounded-[6px]"
          style={{ boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.12)" }}
        >
          <div className="mb-[13px]">
            <div className="flex flex-row">
              <Image
                src={OrangeDot}
                alt="주황닷"
                width={6}
                height={6}
                className="mr-2"
              />
              <p
                className="text-color-neutral-30
                font-sans
                text-base
                font-normal
                leading-[150%]
                tracking-[-0.48px]"
              >
                최대 입장료
              </p>
              {!isFilterSet ? (
                <p
                  className="text-color-neutral-70
                font-sans
                text-base
                not-italic
                font-medium
                leading-[140%]
                tracking-[-0.48px]
                ml-auto"
                >
                  10 원
                </p>
              ) : (
                <p
                  className="text-color-common-0
              font-sans
              text-base
              not-italic
              font-medium
              leading-[140%]
              tracking-[-0.48px]
              ml-auto"
                >
                  10 원
                </p>
              )}
            </div>
            <div className="flex flex-row">
              <Image
                src={OrangeDot}
                alt="주황닷"
                width={6}
                height={6}
                className="mr-2"
              />
              <p
                className="text-color-neutral-30
                font-sans
                text-base
                font-normal
                leading-[150%]
                tracking-[-0.48px]"
              >
                시간대
              </p>
              {!isFilterSet ? (
                <p
                  className="text-color-neutral-70
                font-sans
                text-base
                not-italic
                font-medium
                leading-[140%]
                tracking-[-0.48px]
                ml-auto"
                >
                  00:00 ~ 00:00
                </p>
              ) : (
                <p
                  className="text-color-common-0
                font-sans
                text-base
                not-italic
                font-medium
                leading-[140%]
                tracking-[-0.48px]
                ml-auto"
                >
                  00:00 ~ 00:00
                </p>
              )}
            </div>
          </div>
          <button
            className="w-full h-10 bg-[#FF5940] text-color-common-100 rounded-md 
             flex items-center justify-center"
          >
            <p
              className="font-sans
                text-[14px]
                font-medium
                leading-[140%]
                tracking-[-0.42px]"
              onClick={() => {
                alert("필터 띄우기");
                return;
              }}
            >
              필터 설정하기
            </p>
          </button>
        </div>
      </div>
      <div>
        <div className="bg-color-common-100 rounded-[12px] px-5 py-[30px]">
          <div className="flex flex-row gap-1 mb-4">
            {selOrder === "popular" ? (
              <div
                className="flex px-[14px] py-[8px] justify-center items-center gap-[10px] text-color-common-100 bg-color-common-0 rounded-full"
                onClick={() => {
                  SetSelOrder("popular");
                  return;
                }}
              >
                인기 많은
              </div>
            ) : (
              <div
                className="flex px-[14px] py-[8px] justify-center items-center gap-[10px] text-color-neutral-70 bg-color-common-100 rounded-full border border-[var(--Line-Normal,#D8D8D8)] bg-[var(--Common-100,#FFF)]"
                onClick={() => {
                  SetSelOrder("popular");
                  return;
                }}
              >
                인기 많은
              </div>
            )}
            {selOrder === "fee" ? (
              <div
                className="flex px-[14px] py-[8px] justify-center items-center gap-[10px] text-color-common-100 bg-color-common-0 rounded-full"
                onClick={() => {
                  SetSelOrder("fee");
                  return;
                }}
              >
                입장료 낮은
              </div>
            ) : (
              <div
                className="flex px-[14px] py-[8px] justify-center items-center gap-[10px] text-color-neutral-70 bg-color-common-100 rounded-full border border-[var(--Line-Normal,#D8D8D8)] bg-[var(--Common-100,#FFF)]"
                onClick={() => {
                  SetSelOrder("fee");
                  return;
                }}
              >
                입장료 낮은
              </div>
            )}
            {selOrder === "seats" ? (
              <div
                className="flex px-[14px] py-[8px] justify-center items-center gap-[10px] text-color-common-100 bg-color-common-0 rounded-full"
                onClick={() => {
                  SetSelOrder("seats");
                  return;
                }}
              >
                자리 많은
              </div>
            ) : (
              <div
                className="flex px-[14px] py-[8px] justify-center items-center gap-[10px] text-color-neutral-70 bg-color-common-100 rounded-full border border-[var(--Line-Normal,#D8D8D8)] bg-[var(--Common-100,#FFF)]"
                onClick={() => {
                  SetSelOrder("seats");
                  return;
                }}
              >
                자리 많은
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {arr.map((item, idx) => (
              <div key={idx}>
                <BarCard />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
