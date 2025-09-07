"use client";
import { Button } from "@/components/ui/button";
import arrowIcon from "@/public/icons/icon_arrow.svg";
import kakaoPayIcon from "@/public/icons/icon_kakao_pay.svg";
import tossIcon from "@/public/icons/icon_toss.svg";
import Link from "next/dist/client/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

export default function Page() {
  const searchParams = useSearchParams();
  const reservationNum = searchParams.get("reservationNum");

  function ReservationInfo() {
    return (
      <>
        <span className="bg-primary-normal/10 text-primary-normal mb-4 px-[21px] py-1 font-normal">
          예약 번호
        </span>
        <span className="text-primary-normal mb-3 text-[80px] font-medium">
          {reservationNum}
        </span>
        <span className="mb-[6px] text-2xl font-medium">
          예약이 신청되었어요
        </span>
        <span className="text-sm font-normal">
          예약이 확정되면 알림을 보내드릴게요
        </span>
      </>
    );
  }
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
        <div className="flex h-[108px] w-full flex-col rounded-md shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
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

  function ConfirmButton() {
    return (
      <div className="pb-15 w-full p-5">
        <Link href={"/reservation-check-page"}>
          <Button className="w-full">확인했어요</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center pt-10">
      <div className="h-[106px]" />
      <ReservationInfo />
      <div className="fixed bottom-0 w-full">
        <SendMoneyButton />
        <ConfirmButton />
      </div>
    </div>
  );
}
