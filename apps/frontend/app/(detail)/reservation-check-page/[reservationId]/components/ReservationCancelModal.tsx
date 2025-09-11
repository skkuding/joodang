"use client";
import { safeFetcher } from "@/lib/utils";
import CautionIcon from "@/public/icons/icon_caution.svg";
import CloseIcon from "@/public/icons/icon_close.svg";
import { HTTPError } from "ky";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

interface ReservationCancelModalProps {
  open: boolean;
  onClose: () => void;
  reservationId: number | null;
}
export default function ReservationCancelModal({
  open,
  onClose,
  reservationId,
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
    function readTokensFromLocalStorage(): string[] {
      if (typeof window === "undefined") return [];
      try {
        const raw = localStorage.getItem("reservationToken");
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter(t => typeof t === "string" && t.length > 0);
        }
        return [];
      } catch {
        return [];
      }
    }

    async function checkLogin(): Promise<boolean> {
      try {
        await safeFetcher("user/me/role").json();
        return true;
      } catch (e) {
        if (e instanceof HTTPError && e.response.status === 401) return false;
        return false;
      }
    }

    async function cancelReservation() {
      if (reservationId == null) return;
      const tokens = readTokensFromLocalStorage();
      const isLogin = await checkLogin();
      try {
        let res;
        if (isLogin) {
          res = await safeFetcher.delete(`reservation/${reservationId}`);
        } else {
          res = await safeFetcher.delete(`reservation/${reservationId}`, {
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tokens }),
          });
        }
        if (!res.ok) {
          if (res.status === 409) {
            toast.error("이미 확정된 예약은 취소할 수 없습니다.");
            return;
          }
          throw new Error(`예약 취소 실패 (status ${res.status})`);
        }
        router.push("/reservation-cancel");
        onClose();
      } catch (e) {
        if (e instanceof HTTPError) {
          const status = e.response.status;
          if (status === 409) {
            toast.error("이미 확정된 예약은 취소할 수 없습니다.");
            return;
          }
          console.error("HTTP error:", e);
          toast.error("예약 취소에 실패했습니다. 다시 시도해주세요.");
        } else {
          console.error("Unexpected error:", e);
          toast.error("알 수 없는 오류가 발생했습니다.");
        }
      }
    }

    cancelReservation();
  }

  return (
    <div className={`${open ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div
        className={`fixed inset-0 z-[20] bg-black/80 backdrop-blur-[10px] transition-opacity ${open ? "opacity-100" : "opacity-0"} `}
        onClick={onClose}
      />
      <div
        className={`bg-color-common-100 fixed left-1/2 top-1/2 z-[30] flex h-[289px] w-[335px] -translate-x-1/2 -translate-y-1/2 flex-col rounded-[6px] px-5 pb-6 pt-5 ${open ? "opacity-100" : "opacity-0"} `}
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
