"use client";
import BlackBeer from "@/public/icons/blackBeer.png";
import BlackHouse from "@/public/icons/blackHouse.png";
import BlackReserv from "@/public/icons/blackReserv.svg";
import GrayBeer from "@/public/icons/grayBeer.png";
import GrayHouse from "@/public/icons/grayHouse.png";
import GrayReserv from "@/public/icons/reserv.svg";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { requestPermissionAndSubscribe } from "../../lib/push-subscription";

export function Footer() {
  const router = useRouter();
  const pathname = usePathname();

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
        className="fixed bottom-0 left-0 right-0 z-50 flex h-20 w-full items-center justify-center bg-white"
        style={{ boxShadow: "0 -2px 8px rgba(0,0,0,0.1)" }}
      >
        <div className="-mt-2 flex flex-row justify-center gap-[60px]">
          <div
            onClick={() => {
              router.push("/");
            }}
            className="flex h-[54px] w-[60px] flex-col items-center"
          >
            {pathname === "/" ? (
              <>
                <Image src={BlackHouse} alt="검은 집" width={32} height={32} />
                <p className="text-xs text-black">홈</p>
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
              router.push("/bar-page");
            }}
            className="flex h-[54px] w-[60px] flex-col items-center"
          >
            {pathname === "/bar-page" ? (
              <>
                <Image src={BlackBeer} alt="검은 맥주" width={34} height={34} />
                <p className="text-xs text-black">주점 찾기</p>
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
            {pathname === "/reservation-check-page" ? (
              <>
                <Image src={BlackReserv} alt="예약" width={32} height={32} />
                <p className="text-xs text-black">예약 내역</p>
              </>
            ) : (
              <>
                <Image
                  src={GrayReserv}
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
