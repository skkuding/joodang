"use client";
// FilterSheet.tsx
import OrangeDot from "@/icons/orange_dot.svg";
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

type Props = {
  open: boolean;
  onClose: () => void;
  overlayClear?: number;
  sheetTop?: number;
  maxWidth?: number | string;
  title?: string;
  children?: React.ReactNode;
};

export default function FilterSheet({
  open,
  onClose,
  overlayClear = 0,
  sheetTop = 60,
  title = "필터 설정하기",
  children,
}: Props) {
  const sheetRef = useRef<HTMLDivElement>(null);

  const titleId = useId();
  // TODO: 시간선택도 상태로 처리해야합니다! 그리고 그것도 state 끌올 해야합니다.
  const [price, setPrice] = useState(15000); // 이거 state 끌올 해야함
  function handleSliderValueChange(next: number[]) {
    console.log("next: ", next[0]);
    setPrice(next[0]);
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
      className={`
        fixed inset-0 z-[100]
        ${open ? "pointer-events-auto" : "pointer-events-none"}
      `}
      aria-labelledby={titleId}
      role="dialog"
      aria-modal="true"
      ref={sheetRef}
    >
      <div
        className={`
      absolute inset-x-0
      bg-black/40 backdrop-blur-md
      transition-opacity duration-300
      ${open ? "opacity-100" : "opacity-0"}
    `}
        style={{ top: overlayClear, bottom: 0 }}
        onClick={onClose}
      />

      {/* 3) 시트 (오버레이와 독립적으로 top 제어) */}
      <div
        className={`
          fixed left-1/2 -translate-x-1/2
          bg-white rounded-t-2xl shadow-[0_0_20px_0_rgba(0,0,0,0.12)]
          flex flex-col
          max-h-full overflow-hidden
          transform transition-transform duration-300 ease-out
          ${open ? "translate-y-0" : "translate-y-full"}
        `}
        style={{ top: sheetTop, bottom: 0, width: "100%" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="flex items-center gap-2 px-5 pt-5 pb-3">
          <h2 id={titleId} className="text-base font-medium tracking-[-0.48px]">
            {title}
          </h2>
          <button
            aria-label="닫기"
            className="ml-auto -mr-1 p-2 rounded-md hover:bg-black/5 active:bg-black/10"
            onClick={onClose}
          >
            <X className="h-5 w-5 text-color-neutral-60" />
          </button>
        </div>

        {/* 스크롤 영역 */}
        <div
          className="px-5 pb-4 flex-1 overflow-y-auto w-full"
          style={{ overscrollBehavior: "contain", scrollbarGutter: "stable" }}
        >
          {children ?? (
            <>
              <section className="mb-5">
                <div className="flex items-center">
                  <Image
                    src={OrangeDot}
                    alt="주황닷"
                    width={6}
                    height={6}
                    className="mr-2"
                  />
                  <span className="text-sm text-[var(--Neutral-30,#474747)]">
                    최대 입장료
                  </span>
                  <span className="ml-auto text-color-common-0 text-sm font-medium">
                    {formatWithComma(price)}원
                  </span>
                </div>
                <div className="mt-3 h-10 rounded-lg grid place-items-center text-xs text-[var(--Neutral-40,#5c5c5c)]">
                  <PriceSlider
                    defaultValue={[15000]}
                    value={[price]}
                    min={10000}
                    max={20000}
                    onValueChange={(next) => handleSliderValueChange(next)}
                    className="color-orange"
                  />
                </div>
              </section>

              <section className="mb-5 flex flex-col">
                <div className="flex items-center w-[55px] h-[24px] mb-3">
                  <Image
                    src={OrangeDot}
                    alt="주황닷"
                    width={6}
                    height={6}
                    className="mr-2"
                  />
                  <div className="text-sm text-[var(--Neutral-30,#474747)]">
                    시간대
                  </div>
                </div>
                <div>
                  <Select>
                    <SelectTrigger className="w-full h-[52px] data-[placeholder]:text-color-neutral-90 shadow-[0px_4px_20px_0px_rgba(0,0,0,0.12)]">
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
            className="h-11 w-full rounded-xl bg-[#FF5940] text-white text-sm font-medium"
            onClick={onClose}
          >
            필터 설정하기
          </button>
        </div>
      </div>
    </div>
  );
}
