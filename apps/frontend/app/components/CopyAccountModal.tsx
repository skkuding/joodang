"use client";

import { AccountData } from "@/app/type";
import { cn } from "@/lib/utils";
import X from "@/public/icons/icon_close.svg";
import Image from "next/image";
import { useEffect } from "react";

interface BaseModalProps {
  show: boolean;
  account?: AccountData;
  onClose?: () => void;
}

export default function CopyAccountModal({
  show,
  account,
  onClose,
}: BaseModalProps) {
  const handleCopyClipBoard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("복사 성공!");
    } catch (error) {
      console.log("Error: ", error);
      alert("복사 실패!");
    }
  };

  useEffect(() => {
    if (show) document.body.classList.add("overflow-hidden");
    else document.body.classList.remove("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, [show]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[30] flex items-center justify-center", // 중앙 정렬
        "transition-opacity",
        show ? "opacity-100" : "pointer-events-none opacity-0" // 마운트 유지 + 클릭 방지
      )}
      aria-hidden={!show}
      role="dialog"
    >
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      {/* 모달 박스 */}
      <div className="relative z-[31]">
        <div className="bg-color-common-100 inline-flex w-80 flex-col items-end justify-start gap-5 rounded-md px-5 pb-6 pt-5 shadow-[0_0_20px_rgba(0,0,0,0.08)]">
          <div className="flex flex-col items-center justify-start gap-3 self-stretch">
            <div className="inline-flex items-center justify-end gap-2.5 self-stretch">
              <div className="relative h-6 w-6" onClick={onClose}>
                <Image src={X} alt="x" width={16} height={16} />
              </div>
            </div>
            {account && (
              <div className="text-Common-0 justify-start text-center font-['Pretendard'] text-sm font-normal leading-tight">
                {account.bank} {account.accountNum}
                <br />
                예금주 {account.owner}
              </div>
            )}
          </div>

          <button
            data-property-1="btn_large"
            className="inline-flex items-center justify-center gap-2.5 self-stretch rounded-md bg-[#FF5940] px-4 py-3.5"
          >
            <span
              className="text-color-common-100 justify-start font-['Pretendard'] text-base font-medium leading-snug"
              onClick={() => {
                if (account) {
                  handleCopyClipBoard(account.accountNum);
                }
              }}
            >
              복사하기
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
