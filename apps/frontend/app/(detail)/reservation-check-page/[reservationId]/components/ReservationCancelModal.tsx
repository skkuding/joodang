"use client";
import CautionIcon from "@/public/icons/icon_caution.svg";
import CloseIcon from "@/public/icons/icon_close.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ReservationCancelModalProps {
  open: boolean;
  onClose: () => void;
}
export default function ReservationCancelModal({
  open,
  onClose,
}: ReservationCancelModalProps) {
  const router = useRouter();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  function handleClick() {
    // TODO: 예약 취소
    console.log("예약 취소 api 달아라");
    router.push("/reservation-cancel");
    onClose();
  }

  return (
    <div className={`${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div
        className={`fixed inset-0 z-[20] bg-black/80 backdrop-blur-[10px] transition-opacity ${open ? "opacity-100" : "opacity-0"} `}
        onClick={onClose}
      />
      <div
        className={`bg-color-common-100 fixed absolute left-1/2 top-1/2 z-[30] flex h-[289px] w-[335px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[6px] px-5 pb-6 pt-5 ${open ? "opacity-100" : "opacity-0"} `}
      >
        <section className="mb-5">
          <div
            className="flex flex-row justify-end"
            onClick={() => {
              onClose();
            }}
          >
            <Image src={CloseIcon} alt="close" width={16} height={16} />
          </div>

          <div className="mb-[14px] flex flex-col items-center justify-center">
            <Image
              src={CautionIcon}
              alt="caution"
              width={48}
              height={48}
              className="mb-1"
            />
            <p className="text-color-common-0 text-xl font-medium leading-7">
              예약을 취소하시겠습니까?
            </p>
          </div>

          <div className="text-color-neutral-40 flex h-[57px] flex-col items-center text-xs font-normal leading-tight">
            <p>예약 취소 시 선입금은 별도로 환불받으셔야 하며, </p>
            <p>환불 관련 수수료 및 처리 기간은 해당 주점에</p>
            <p>직접 문의해 주시기 바랍니다.</p>
          </div>
        </section>
        <button
          className="text-color-common-100 item-center flex h-[50px] w-full flex-row justify-center rounded-md bg-[#FF5940] px-4 py-[14px] font-medium"
          onClick={handleClick}
        >
          취소할게요
        </button>
      </div>
    </div>
  );
}
