"use client";
import { filterVariables } from "@/app/type";
import { Button } from "@/components/ui/button";
import { cn, formatDateWithDay, formatWithComma } from "@/lib/utils";
import OrangeDot from "@/public/icons/orange_dot.svg";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
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
  const [newFilterValue, setNewFilterValue] =
    useState<filterVariables>(filterValue);

  const titleId = useId();

  const [dayCandidates, setDayCandidates] = useState<string[]>([
    "2025-09-11",
    "2025-09-12",
  ]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  function handleDayChange(selDate: string) {
    setNewFilterValue(prev => {
      return { ...prev, days: selDate };
    });
  }

  function handleSliderValueChange(next: number[]) {
    setNewFilterValue(prev => {
      return { ...prev, maxFee: next[0] };
    });
  }

  function handleClickFilterSet() {
    setFilterValue(newFilterValue);
    setIsFilterSet(true);
    onClose();
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
    >
      <div
        className={`absolute inset-x-0 bg-black/80 backdrop-blur-[10px] transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"} `}
        style={{ top: overlayClear, bottom: 0 }}
        onClick={onClose}
      />

      {/* 3) 시트 (오버레이와 독립적으로 top 제어) */}
      <div
        className={`fixed left-1/2 flex max-h-full -translate-x-1/2 transform flex-col rounded-t-2xl bg-white transition-transform duration-300 ease-out ${open ? "translate-y-0" : "translate-y-full"} `}
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
            <div className="flex flex-col gap-8">
              <section>
                <div className="mb-3 flex items-center">
                  <Image
                    src={OrangeDot}
                    alt="주황닷"
                    width={6}
                    height={6}
                    className="mr-2"
                  />
                  <span className="text-color-common-0 justify-start text-base font-medium leading-snug">
                    날짜
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {dayCandidates.map(dateKey => {
                    return (
                      <Button
                        key={dateKey}
                        variant={
                          selectedDate === dateKey ? "selected" : "outline"
                        }
                        className={cn(
                          "h-[37px]",
                          selectedDate === dateKey
                            ? ""
                            : "border-color-neutral-95 text-color-neutral-30"
                        )}
                        onClick={() => {
                          setSelectedDate(dateKey);
                          handleDayChange(dateKey);
                        }}
                      >
                        <span className="text-sm font-normal">
                          {formatDateWithDay(dateKey)}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              </section>

              <section>
                <div className="mb-4 flex items-center">
                  <Image
                    src={OrangeDot}
                    alt="주황닷"
                    width={6}
                    height={6}
                    className="mr-2"
                  />
                  <span className="text-color-neutral-10 justify-start font-['Pretendard'] text-base font-medium leading-normal">
                    최대 입장료
                  </span>
                  <span className="text-color-common-0 ml-auto text-sm font-medium">
                    {formatWithComma(newFilterValue.maxFee)}원
                  </span>
                </div>
                <div className="mb-1 h-4 text-xs">
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
                <div className="item-center text-color-neutral-60 flex flex-row justify-between text-xs font-normal">
                  <p>10,000 원</p>
                  <p>15,000 원</p>
                  <p>20,000 원</p>
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
                  <div className="text-neutral-10 justify-start text-base font-medium leading-normal">
                    시간대
                  </div>
                </div>
                <div>
                  <Select>
                    <SelectTrigger
                      className="data-[placeholder]:text-color-neutral-90 h-[52px] w-full px-4 py-[14px] text-sm"
                      size="custom"
                    >
                      <SelectValue placeholder="시간대를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent
                      className="z-[200] w-full"
                      avoidCollisions={true}
                    >
                      <SelectItem
                        className="flex h-[49px] flex-row justify-between px-4 py-[14px] text-sm font-normal"
                        value="light"
                      >
                        Light1
                      </SelectItem>
                      <SelectItem
                        className="flex h-[49px] flex-row justify-between px-4 py-[14px] text-sm font-normal"
                        value="light2"
                      >
                        Light2
                      </SelectItem>
                      <SelectItem
                        className="flex h-[49px] flex-row justify-between px-4 py-[14px] text-sm font-normal"
                        value="light3"
                      >
                        Light3
                      </SelectItem>
                      <SelectItem
                        className="flex h-[49px] flex-row justify-between px-4 py-[14px] text-sm font-normal"
                        value="light4"
                      >
                        Light4
                      </SelectItem>
                      <SelectItem
                        className="flex h-[49px] flex-row justify-between px-4 py-[14px] text-sm font-normal"
                        value="light5"
                      >
                        Light5
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </section>
            </div>
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
