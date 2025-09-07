"use client";
import CopyAccountModal from "@/app/components/CopyAccountModal";
import { ReservationResponse } from "@/app/type";
import { Button } from "@/components/ui/button";
import arrowIcon from "@/public/icons/icon_arrow.svg";
import kakaoPayIcon from "@/public/icons/icon_kakao_pay.svg";
import tossIcon from "@/public/icons/icon_toss.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ReservationConfirmButton } from "../components/ReservationConfirmButton";
import { ReservationInfo } from "../components/ReservationInfo";

export default function Page() {
  const [reservationData, setReservationData] =
    useState<ReservationResponse | null>(null);

  useEffect(() => {
    const storedData = sessionStorage.getItem("reservationData");
    if (storedData) {
      setReservationData(JSON.parse(storedData));
      // 사용 후 제거 (선택사항)
      sessionStorage.removeItem("reservationData");
    }
  }, []);

  function SendMoneyButton() {
    const handleTossPayment = () => {
      // 토스페이 앱 스킴 URL
      const tossAppUrl = "supertoss://send";
      // 웹 버전 URL (앱이 설치되지 않은 경우)
      const tossWebUrl = "https://toss.me";

      // 모바일에서 앱 스킴 시도
      if (
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        window.location.href = tossAppUrl;

        // 앱이 설치되지 않은 경우를 대비해 웹 버전으로 fallback
        setTimeout(() => {
          window.location.href = tossWebUrl;
        }, 1000);
      } else {
        // 데스크톱에서는 웹 버전으로 바로 이동
        window.open(tossWebUrl, "_blank");
      }
    };

    const handleKakaoPayment = () => {
      // 카카오페이 앱 스킴 URL
      const kakaoPayUrl = "kakaotalk://kakaopay";
      // 웹 버전 URL
      const kakaoWebUrl = "https://pay.kakao.com";

      if (
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        window.location.href = kakaoPayUrl;

        setTimeout(() => {
          window.location.href = kakaoWebUrl;
        }, 1000);
      } else {
        window.open(kakaoWebUrl, "_blank");
      }
    };
    return (
      <div className="mb-10 w-full px-5">
        <div className="flex w-full flex-col rounded-md px-4 py-3 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
          <div className="bg-color-neutral-99 rounded-md px-3 py-2 text-base font-normal">
            <div className="flex w-full justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
                <span>입금 계좌</span>
              </div>
              {reservationData && (
                <CopyAccountModal store={reservationData?.store} />
              )}
            </div>
          </div>
          <Button
            variant={"ghost"}
            className="flex justify-between"
            onClick={handleTossPayment}
          >
            <div className="flex gap-2">
              <Image src={tossIcon} alt="Toss" />
              <span>토스 페이 결제</span>
            </div>
            <Image src={arrowIcon} alt="arrow" />
          </Button>
          <Button
            variant={"ghost"}
            className="flex justify-between"
            onClick={handleKakaoPayment}
          >
            <div className="flex gap-2">
              <Image src={kakaoPayIcon} alt="Kakao Pay" />
              <span>카카오 페이 결제</span>
            </div>
            <Image src={arrowIcon} alt="arrow" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="h-[106px]" />
      {reservationData && (
        <ReservationInfo
          reservationNum={reservationData?.reservationNum.toString()}
        />
      )}
      <div className="fixed bottom-0 w-full">
        <SendMoneyButton />
        <div className="pb-15 w-full p-5">
          <ReservationConfirmButton />
        </div>
      </div>
    </div>
  );
}
