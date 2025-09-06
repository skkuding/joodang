"use client";
import { filterVariables } from "@/app/type";
import OrangeDot from "@/public/icons/orange_dot.svg";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { formatWithComma } from "../../../../lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../ui/select";
import PriceSlider from "./PriceSlider";

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  overlayClear?: number;
  sheetTop?: number;
  maxWidth?: number | string;
  title?: string;
  children?: React.ReactNode;
  filterValue: filterVariables;
  setFilterValue: React.Dispatch<React.SetStateAction<filterVariables>>;
  setIsFilterSet: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FilterSheet({
  open,
  onClose,
  overlayClear = 0,
  sheetTop = 60,
  title = "필터 설정하기",
  children,
  filterValue,
  setFilterValue,
  setIsFilterSet,
}: FilterSheetProps) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [newFilterValue, setNewFilterValue] =
    useState<filterVariables>(filterValue);

  const titleId = useId();

  function handleSliderValueChange(next: number[]) {
    setNewFilterValue(prev => {
      return { ...prev, maxFee: next[0] };
    });
  }

  function handleClickFilterSet() {
    setFilterValue(newFilterValue);
    setIsFilterSet(true);
    onClose();
    console.log("잉?");
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[100] ${open ? "pointer-events-auto" : "pointer-events-none"} `}
      aria-labelledby={titleId}
      role="dialog"
      aria-modal="true"
      ref={sheetRef}
    >
      <div
        className={`absolute inset-x-0 bg-black/80 backdrop-blur-[10px] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"} `}
        style={{ top: overlayClear, bottom: 0 }}
        onClick={onClose}
      />

      {/* 3) 시트 (오버레이와 독립적으로 top 제어) */}
      <div
        className={`fixed left-1/2 flex max-h-full -translate-x-1/2 transform flex-col overflow-hidden rounded-t-2xl bg-white shadow-[0_0_20px_0_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out ${open ? "translate-y-0" : "translate-y-full"} `}
        style={{ top: sheetTop, bottom: 0, width: "100%" }}
        onClick={e => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center gap-2 px-5 pb-6 pt-5">
          <h2
            id={titleId}
            className="text-color-common-0 justify-start font-['Pretendard'] text-xl font-medium leading-7"
          >
            {title}
          </h2>
          <button
            aria-label="닫기"
            className="-mr-1 ml-auto rounded-md p-2 hover:bg-black/5 active:bg-black/10"
            onClick={onClose}
          >
            <X className="text-color-neutral-60 h-5 w-5" />
          </button>
        </div>

        {/* 스크롤 영역 */}
        <div
          className="w-full flex-1 space-y-8 overflow-y-auto px-5 pb-4"
          style={{ overscrollBehavior: "contain", scrollbarGutter: "stable" }}
        >
          {children ?? (
            <>
              <section>
                <div className="mb-3 flex items-center">
                  <Image
                    src={OrangeDot}
                    alt="주황닷"
                    width={6}
                    height={6}
                    className="mr-2"
                  />
                  <span className="text-color-common-0 justify-start font-['Pretendard'] text-base font-medium leading-snug">
                    날짜
                  </span>
                </div>
                <div className="mt-3 flex h-10 flex-row place-items-center rounded-lg text-xs text-[var(--Neutral-40,#5c5c5c)]">
                  <div>박스 </div>
                  <div>박스 </div>
                </div>
              </section>

              <section>
                <div className="flex items-center">
                  <Image
                    src={OrangeDot}
                    alt="주황닷"
                    width={6}
                    height={6}
                    className="mr-2"
                  />
                  <span className="text-color-neutral-10 justify-start font-['Pretendard'] text-base font-normal leading-normal">
                    최대 입장료
                  </span>
                  <span className="text-color-common-0 ml-auto text-sm font-medium">
                    {formatWithComma(newFilterValue.maxFee)}원
                  </span>
                </div>
                <div className="mt-3 grid h-10 place-items-center rounded-lg text-xs text-[var(--Neutral-40,#5c5c5c)]">
                  <PriceSlider
                    defaultValue={[15000]}
                    value={[newFilterValue.maxFee]}
                    min={10000}
                    max={20000}
                    step={100}
                    onValueChange={next => handleSliderValueChange(next)}
                    className="color-orange"
                  />
                </div>
              </section>

              <section className="mb-5 flex flex-col">
                <div className="mb-3 flex h-[24px] items-center">
                  <Image
                    src={OrangeDot}
                    alt="주황닷"
                    width={6}
                    height={6}
                    className="mr-2"
                  />
                  <div className="text-neutral-10 justify-start font-['Pretendard'] text-base font-normal leading-normal">
                    시간대
                  </div>
                </div>
                <div>
                  <Select>
                    <SelectTrigger className="data-[placeholder]:text-color-neutral-90 h-[52px] w-full shadow-[0px_4px_20px_0px_rgba(0,0,0,0.12)]">
                      <SelectValue placeholder="시간대를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent
                      className="z-[200] w-full"
                      avoidCollisions={true}
                      portalContainer={sheetRef.current}
                    >
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="sㅈystem">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </section>
            </>
          )}
        </div>

        {/* 하단 고정 버튼 */}
        <div className="p-5">
          <button
            className="h-11 w-full rounded-xl bg-[#FF5940] text-sm font-medium text-white"
            onClick={handleClickFilterSet}
          >
            필터 설정하기
          </button>
        </div>
      </div>
    </div>
  );
}
