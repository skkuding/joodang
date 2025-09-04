"use client";

import locationIcon from "@/public/icons/icon_location.svg";
import OrangeDot from "@/public/icons/orange_dot.svg";
import Image from "next/image";
import { useState } from "react";
import BarCard from "./components/BarCard";
import FilterSetting from "./components/FilterSetting";

export default function BarPage() {
  const arr = [1, 2, 3];
  const [isFilterSet, SetIsFilterSet] = useState(false);
  const [selOrder, SetSelOrder] = useState("popular");

  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="mt-[48px] p-5">
        <FilterSetting open={open} onClose={() => setOpen(false)} />
        <div>
          <Image src={locationIcon} alt="주황위치" width={24} height={24} />
          <div className="flex flex-row justify-between">
            <div className="text-color-common-0 mt-1 font-sans text-xl font-medium leading-[140%] tracking-[-0.6px]">
              주점을 찾아볼까요?
            </div>
            <button className="justify-item item-center rounded-1 flex h-[25px] w-[95px] flex-row bg-[#FF594014] px-2 py-1">
              <Image src={locationIcon} alt="지도버튼" width={12} height={12} />
              <p className="font-sans text-xs font-normal leading-[140%] tracking-[-0.36px] text-[#FF5940]">
                지도에서 찾기
              </p>
            </button>
          </div>

          <div className="text-color-neutral-40 mb-5 mt-3 font-sans text-[14px] font-normal leading-[150%] tracking-[-0.42px]">
            <p>필터를 설정하면 알맞는 주점을</p>
            <p>주당이 찾아드려요!</p>
          </div>
        </div>
        <div
          className="bg-color-common-100 h-[149px] w-full rounded-[6px] p-5"
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
              <p className="text-color-neutral-30 font-sans text-base font-normal leading-[150%] tracking-[-0.48px]">
                최대 입장료
              </p>
              {!isFilterSet ? (
                <p className="text-color-neutral-70 ml-auto font-sans text-base font-medium not-italic leading-[140%] tracking-[-0.48px]">
                  10 원
                </p>
              ) : (
                <p className="text-color-common-0 ml-auto font-sans text-base font-medium not-italic leading-[140%] tracking-[-0.48px]">
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
              <p className="text-color-neutral-30 font-sans text-base font-normal leading-[150%] tracking-[-0.48px]">
                시간대
              </p>
              {!isFilterSet ? (
                <p className="text-color-neutral-70 ml-auto font-sans text-base font-medium not-italic leading-[140%] tracking-[-0.48px]">
                  00:00 ~ 00:00
                </p>
              ) : (
                <p className="text-color-common-0 ml-auto font-sans text-base font-medium not-italic leading-[140%] tracking-[-0.48px]">
                  00:00 ~ 00:00
                </p>
              )}
            </div>
          </div>
          <button className="text-color-common-100 flex h-10 w-full items-center justify-center rounded-md bg-[#FF5940]">
            <p
              className="font-sans text-[14px] font-medium leading-[140%] tracking-[-0.42px]"
              onClick={() => {
                setOpen(true);
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
          <div className="mb-4 flex flex-row gap-1">
            {selOrder === "popular" ? (
              <div
                className="text-color-common-100 bg-color-common-0 flex items-center justify-center gap-[10px] rounded-full px-[14px] py-[8px]"
                onClick={() => {
                  SetSelOrder("popular");
                  return;
                }}
              >
                인기 많은
              </div>
            ) : (
              <div
                className="text-color-neutral-70 bg-color-common-100 flex items-center justify-center gap-[10px] rounded-full border border-[var(--Line-Normal,#D8D8D8)] bg-[var(--Common-100,#FFF)] px-[14px] py-[8px]"
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
                className="text-color-common-100 bg-color-common-0 flex items-center justify-center gap-[10px] rounded-full px-[14px] py-[8px]"
                onClick={() => {
                  SetSelOrder("fee");
                  return;
                }}
              >
                입장료 낮은
              </div>
            ) : (
              <div
                className="text-color-neutral-70 bg-color-common-100 flex items-center justify-center gap-[10px] rounded-full border border-[var(--Line-Normal,#D8D8D8)] bg-[var(--Common-100,#FFF)] px-[14px] py-[8px]"
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
                className="text-color-common-100 bg-color-common-0 flex items-center justify-center gap-[10px] rounded-full px-[14px] py-[8px]"
                onClick={() => {
                  SetSelOrder("seats");
                  return;
                }}
              >
                자리 많은
              </div>
            ) : (
              <div
                className="text-color-neutral-70 bg-color-common-100 flex items-center justify-center gap-[10px] rounded-full border border-[var(--Line-Normal,#D8D8D8)] bg-[var(--Common-100,#FFF)] px-[14px] py-[8px]"
                onClick={() => {
                  SetSelOrder("seats");
                  return;
                }}
              >
                자리 많은
              </div>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
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
