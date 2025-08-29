"use client";
// FilterSheet.tsx
import OrangeDot from "@/icons/orange_dot.svg";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useId, useState } from "react";
import PriceSlider from "./Slider";

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
  overlayClear = 68,
  sheetTop = 150,
  maxWidth = 375,
  title = "필터 설정하기",
  children,
}: Props) {
  const titleId = useId();
  const [price, setPrice] = useState(15000);

  // ESC로 닫기 + body 스크롤 잠금
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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100]"
      aria-labelledby={titleId}
      role="dialog"
      aria-modal="true"
    >
      {/* 1) 위쪽 투명 영역 (클릭 통과) */}
      <div
        className="absolute inset-x-0 top-0"
        style={{ height: overlayClear, pointerEvents: "none" }}
      />
      {/* 2) 아래 어두운 영역 (클릭 시 닫힘) */}
      <div
        className="absolute inset-x-0 bg-black/60"
        style={{ top: overlayClear, bottom: 0 }}
        onClick={onClose}
      />

      {/* 3) 시트 (오버레이와 독립적으로 top 제어) */}
      <div
        className="
          fixed left-1/2 -translate-x-1/2
          bg-white rounded-t-2xl shadow-[0_0_20px_0_rgba(0,0,0,0.12)]
          flex flex-col
          max-h-[85vh] overflow-hidden
        "
        style={{ top: sheetTop, bottom: 0, width: "100%", maxWidth }}
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
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 스크롤 영역 */}
        <div className="px-5 pb-4 flex-1 overflow-y-auto">
          {children ?? (
            <>
              {/* 예시 섹션: 최대 입장료 */}

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
                    16,000원
                  </span>
                </div>
                <div className="mt-3 h-10 rounded-lg bg-[var(--Neutral-99,#f6f6f6)] grid place-items-center text-xs text-[var(--Neutral-40,#5c5c5c)]">
                  <PriceSlider
                    options={[10000, 15000, 20000]}
                    value={price}
                    onChange={setPrice}
                  />
                </div>
              </section>

              <section className="mb-5">
                <div className="flex items-center">
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
                  <select id="price" name="price">
                    <option value="10000">1시간</option>
                    <option value="15000">2시간</option>
                    <option value="20000">3시간</option>
                  </select>
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
