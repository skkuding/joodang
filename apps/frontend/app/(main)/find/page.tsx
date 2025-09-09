"use client";

import { Store } from "@/app/type";
import {
  formatDateDash2Point,
  formatWithComma,
  kstDateTimeToUtcIso,
  safeFetcher,
} from "@/lib/utils";
import locationIcon from "@/public/icons/icon_location.svg";
import OrangeDot from "@/public/icons/orange_dot.svg";
import { useFilter } from "@/src/context/FilterContext";
import { Button } from "@/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import BarCard from "./components/BarCard";
import FilterSheet from "./components/FilterSheet";

// alert! 시간 값을 보내줄 때는 UTC로 보내줘야합니다.

export default function BarPage() {
  const [filterOpen, setFilterOpen] = useState(false);
  const { filterValue, setFilterValue, isFilterSet, setIsFilterSet } =
    useFilter();

  const [selOrder, SetSelOrder] = useState("popular");
  const [stores, setStores] = useState<Store[]>([]);
  const [fetchTrigger, setFetchTrigger] = useState<number>(0);
  function getData() {
    setFetchTrigger(prev => {
      return prev + 1;
    });
  }

  useEffect(() => {
    async function fetchStores() {
      let url = `store?sort=${selOrder}&maxFee=${filterValue.maxFee}`;

      if (filterValue.days !== "0000-00-00") {
        url += `&startTime=${kstDateTimeToUtcIso(filterValue.days)}&endTime=${kstDateTimeToUtcIso(filterValue.days, "23:59")}`;
      }
      const stores: Store[] = await safeFetcher(url).json();
      setStores(stores);
    }
    fetchStores();
  }, [fetchTrigger, filterValue]);

  return (
    <div>
      <div className="mt-[36px] p-5">
        <FilterSheet
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          setIsFilterSet={setIsFilterSet}
        />
        <div>
          <Image src={locationIcon} alt="주황위치" width={24} height={24} />
          <div className="flex flex-row justify-between">
            <div className="text-color-common-0 mt-1 font-sans text-xl font-medium leading-[140%] tracking-[-0.6px]">
              주점을 찾아볼까요?
            </div>
            <Link href={`/map/1`}>
              <button className="justify-item item-center rounded-1 flex h-[25px] w-[95px] flex-row bg-[#FF594014] px-2 py-1">
                <Image
                  src={locationIcon}
                  alt="지도버튼"
                  width={12}
                  height={12}
                />
                <p className="font-sans text-xs font-normal leading-[140%] tracking-[-0.36px] text-[#FF5940]">
                  지도에서 찾기
                </p>
              </button>
            </Link>
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
          <div className="mb-[13px] flex flex-col gap-2">
            <div className="flex flex-row">
              <Image
                src={OrangeDot}
                alt="주황닷"
                width={6}
                height={6}
                className="mr-2"
              />
              <p className="text-color-neutral-30 text-sm font-normal leading-[150%] tracking-[-0.48px]">
                최대 입장료
              </p>
              {!isFilterSet ? (
                <p className="text-color-neutral-70 ml-auto text-sm font-normal not-italic leading-[140%] tracking-[-0.48px]">
                  0 원
                </p>
              ) : (
                <p className="text-color-common-0 ml-auto text-sm font-normal leading-normal">
                  {formatWithComma(filterValue.maxFee)} 원
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
              <p className="text-color-neutral-30 text-sm font-normal leading-[150%] tracking-[-0.48px]">
                날짜
              </p>
              {!isFilterSet ? (
                <p className="text-color-neutral-70 ml-auto text-sm font-normal not-italic leading-[140%] tracking-[-0.48px]">
                  0000. 00. 00
                </p>
              ) : (
                <p className="text-color-common-0 ml-auto text-sm font-normal leading-normal">
                  {formatDateDash2Point(filterValue.days)}
                </p>
              )}
            </div>
          </div>
          <Button className="flex h-10">
            <p
              className="text-[14px] font-medium leading-[140%] tracking-[-0.42px]"
              onClick={() => {
                setFilterOpen(true);
                return;
              }}
            >
              필터 설정하기
            </p>
          </Button>
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
                  getData();
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
                  getData();
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
                  getData();
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
                  getData();
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
                  getData();
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
                  getData();
                  return;
                }}
              >
                자리 많은
              </div>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            {stores.map((store, idx) => {
              return <BarCard store={store} key={idx} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
