"use client";
import GrayBeer from "@/public/icons/icon_gray_beer.svg";
import GrayHouse from "@/public/icons/icon_gray_house.svg";
import GrayReservation from "@/public/icons/icon_gray_reservation.svg";
import OrangeBeer from "@/public/icons/icon_orange_beer.svg";
import OrangeHouse from "@/public/icons/icon_orange_house.svg";
import OrangeReservation from "@/public/icons/icon_orange_reservation.svg";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { requestPermissionAndSubscribe } from "../../lib/push-subscription";

export function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const [curPos, setCurPos] = useState<string>("/");

  useEffect(() => {
    if (!pathname) return;

    const secondSlashIdx = pathname.indexOf("/", 1);
    if (secondSlashIdx === -1) {
      setCurPos(pathname);
    } else {
      setCurPos(pathname.slice(0, secondSlashIdx));
    }
  }, [pathname]);

  const onClickReservationCheck = async () => {
    try {
      await requestPermissionAndSubscribe();
    } catch (e) {
      console.error("푸시 구독 실패:", e);
    }
  };

  return (
    <footer>
      <div
        className="fixed bottom-0 left-0 right-0 z-10 flex h-20 w-full items-center justify-center bg-white"
        style={{ boxShadow: "0 -2px 8px rgba(0,0,0,0.1)" }}
      >
        <div className="-mt-2 flex flex-row justify-center gap-[60px]">
          <div
            onClick={() => {
              router.push("/");
            }}
            className="flex h-[54px] w-[60px] flex-col items-center"
          >
            {curPos === "/" ? (
              <>
                <Image
                  src={OrangeHouse}
                  alt="오렌지 집"
                  width={32}
                  height={32}
                />
                <p className="text-xs text-[#FF5940]">홈</p>
              </>
            ) : (
              <>
                <Image src={GrayHouse} alt="회색 집" width={32} height={32} />
                <p className="text-xs text-[#9B9B9B]">홈</p>
              </>
            )}
          </div>
          <div
            onClick={() => {
              router.push("/find");
            }}
            className="flex h-[54px] w-[60px] flex-col items-center"
          >
            {curPos === "/find" ? (
              <>
                <Image
                  src={OrangeBeer}
                  alt="오렌지 맥주"
                  width={34}
                  height={34}
                />
                <p className="text-xs text-[#FF5940]">주점 찾기</p>
              </>
            ) : (
              <>
                <Image src={GrayBeer} alt="회색 맥주" width={34} height={34} />
                <p className="text-xs text-[#9B9B9B]">주점 찾기</p>
              </>
            )}
          </div>
          <div
            onClick={() => {
              router.push("/reservation-check-page");
              onClickReservationCheck();
            }}
            className="flex h-[54px] w-[60px] flex-col items-center"
          >
            {curPos === "/reservation-check-page" ? (
              <>
                <Image
                  src={OrangeReservation}
                  alt="오렌지 예약"
                  width={32}
                  height={32}
                />
                <p className="text-xs text-[#FF5940]">예약 내역</p>
              </>
            ) : (
              <>
                <Image
                  src={GrayReservation}
                  alt="회색 예약"
                  width={32}
                  height={32}
                />
                <p className="text-xs text-[#9B9B9B]">예약 내역</p>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
