"use client";
import CopyAccountModal from "@/app/components/CopyAccountModal";
import { FloatingBottomBar } from "@/app/components/FloatingBottomBar";
import { ReservationResponse } from "@/app/type";
import { Button } from "@/components/ui/button";
import { BankCodes } from "@/constant";
import arrowIcon from "@/public/icons/icon_arrow.svg";
import cautionIcon from "@/public/icons/icon_caution.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ReservationConfirmButton } from "../components/ReservationConfirmButton";
import { ReservationInfo } from "../components/ReservationInfo";

export default function Page() {
  const [reservationData, setReservationData] =
    useState<ReservationResponse | null>(null);

  const [amount, setAmount] = useState<number | null>(null);
  const [bankName, setBankName] = useState<string | null>(null);

  useEffect(() => {
    const storedReservationData = sessionStorage.getItem("reservationData");
    if (storedReservationData) {
      setReservationData(JSON.parse(storedReservationData));
    }
  }, []);

  useEffect(() => {
    if (reservationData?.store.reservationFee && reservationData?.headcount) {
      setAmount(
        reservationData.store.reservationFee * reservationData.headcount
      );
      setBankName(BankCodes[reservationData.store.bankCode]);
    }
  }, [reservationData]);

  const copyAccountToClipboard = async () => {
    const text =
      `${bankName ?? ""} ${reservationData?.store.accountNumber ?? ""}`.trim();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      // toast.success("계좌번호가 복사되었습니다");
    } catch {
      // Fallback (일부 iOS/Safari/PWA)
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
        // toast.success("계좌번호가 복사되었습니다");
      } catch {
        // toast.error("복사에 실패했습니다");
      } finally {
        document.body.removeChild(ta);
      }
    }
  };

  function SendMoneyButton() {
    const handleTossPayment = async () => {
      // 토스페이 앱 스킴 URL
      const tossAppUrl = `supertoss://send?amount=${amount ?? ""}&bank=${bankName ?? ""}&accountNo=${reservationData?.store.accountNumber ?? ""}`;
      // 웹 버전 URL (앱이 설치되지 않은 경우)
      const tossWebUrl = "https://toss.me";

      await copyAccountToClipboard();

      // 모바일에서 앱 스킴 시도
      if (
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        window.location.href = tossAppUrl;
      } else {
        // 데스크톱에서는 웹 버전으로 바로 이동
        window.open(tossWebUrl, "_blank");
      }
    };

    const handleKakaoPayment = async () => {
      // 카카오페이 앱 스킴 URL
      const kakaoPayUrl = `https://link.kakaopay.com/t/money/to/bank?amount=${amount ?? ""}&bank_code=${reservationData?.store.bankCode ?? ""}&bank_account_number=${reservationData?.store.accountNumber ?? ""}`;
      // 웹 버전 URL
      await copyAccountToClipboard();
      if (
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        window.location.href = kakaoPayUrl;
      } else {
        window.open(kakaoPayUrl, "_blank");
      }
    };
    return (
      <div className="w-full px-5">
        <div className="flex w-full flex-col rounded-md px-4 py-3 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
          <div className="bg-color-neutral-99 rounded-md px-3 py-2 text-base font-normal">
            <div className="flex w-full justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
                <span>입금 계좌</span>
              </div>
              {reservationData && (
                <CopyAccountModal store={reservationData.store} />
              )}
            </div>
          </div>
          <Button
            variant={"ghost"}
            className="flex justify-between"
            onClick={handleTossPayment}
          >
            <div className="flex gap-2">
              <object data="/icons/icon_toss.png" width={61} height={24} />
              <span>토스로 송금하기</span>
            </div>
            <Image src={arrowIcon} alt="arrow" />
          </Button>
          <Button
            variant={"ghost"}
            className="flex justify-between"
            onClick={handleKakaoPayment}
          >
            <div className="flex gap-2">
              <div className="w-[61px]">
                <object
                  data="/icons/icon_kakao_pay.png"
                  width={61}
                  height={24}
                />
              </div>
              <span>카카오페이로 송금하기</span>
            </div>
            <Image src={arrowIcon} alt="arrow" />
          </Button>
        </div>
        <div className="mt-[6px] flex w-full justify-center gap-[2px]">
          <Image src={cautionIcon} alt="caution" width={14} />
          <span className="text-primary-normal text-xs font-normal">
            입금 시 예약 번호를 함께 작성해주세요
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center pt-[10vh]">
      <div className="pb-15 flex flex-col items-center justify-center">
        {reservationData && (
          <ReservationInfo
            reservationNum={reservationData?.reservationNum.toString()}
          />
        )}
      </div>
      <SendMoneyButton />
      <FloatingBottomBar>
        <ReservationConfirmButton />
      </FloatingBottomBar>
    </div>
  );
}
