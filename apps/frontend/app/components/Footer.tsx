"use client";
import { safeFetcher } from "@/lib/utils";
import GrayBeer from "@/public/icons/icon_gray_beer.svg";
import GrayHouse from "@/public/icons/icon_gray_house.svg";
import GrayMypage from "@/public/icons/icon_gray_mypage.svg";
import GrayReservation from "@/public/icons/icon_gray_reservation.svg";
import OrangeBeer from "@/public/icons/icon_orange_beer.svg";
import OrangeHouse from "@/public/icons/icon_orange_house.svg";
import OrangeMypage from "@/public/icons/icon_orange_mypage.svg";
import OrangeReservation from "@/public/icons/icon_orange_reservation.svg";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { requestPermissionAndSubscribe } from "../../lib/push-subscription";
import { RoleEnum } from "../type";

export function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const [curPos, setCurPos] = useState<string>("/");
  const [role, setRole] = useState<RoleEnum | null>(null);

  useEffect(() => {
    if (!pathname) return;

    if (
      pathname === "/management/home" ||
      pathname === "/management/store" ||
      pathname === "/management/reservation"
    ) {
      setCurPos(pathname);
    } else {
      const secondSlashIdx = pathname.indexOf("/", 1);
      if (secondSlashIdx === -1) {
        setCurPos(pathname);
      } else {
        setCurPos(pathname.slice(0, secondSlashIdx));
      }
    }
  }, [pathname]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response: { role: string } = await safeFetcher
          .get("user/me/role")
          .json();
        console.log("role: ", response);
        if (response.role === RoleEnum.USER) {
          setRole(RoleEnum.USER);
        } else if (response.role === RoleEnum.STAFF) {
          setRole(RoleEnum.STAFF);
        } else if (response.role === RoleEnum.OWNER) {
          setRole(RoleEnum.OWNER);
        } else if (response.role === RoleEnum.ADMIN) {
          setRole(RoleEnum.ADMIN);
        }
      } catch {}
    };

    checkAuth();
  }, []);

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
        <div className="-mt-2 flex w-full flex-row justify-between px-[40px]">
          <div
            onClick={() => {
              if (
                role === RoleEnum.STAFF ||
                role === RoleEnum.OWNER ||
                role === RoleEnum.ADMIN
              ) {
                router.push("/management/home");
                return;
              } else {
                router.push("/");
              }
            }}
            className="flex h-[54px] w-[60px] flex-col items-center"
          >
            {curPos === "/" || curPos === "/management/home" ? (
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
              if (
                role === RoleEnum.STAFF ||
                role === RoleEnum.OWNER ||
                role === RoleEnum.ADMIN
              ) {
                router.push("/management/store");
                return;
              } else {
                router.push("/find");
              }
            }}
            className="flex h-[54px] w-[60px] flex-col items-center"
          >
            {curPos === "/find" || curPos === "/management/store" ? (
              <>
                <Image
                  src={OrangeBeer}
                  alt="오렌지 맥주"
                  width={34}
                  height={34}
                />
                <p className="text-xs text-[#FF5940]">
                  {role === RoleEnum.STAFF ||
                  role === RoleEnum.OWNER ||
                  role === RoleEnum.ADMIN
                    ? "주점 관리"
                    : "주점 찾기"}
                </p>
              </>
            ) : (
              <>
                <Image src={GrayBeer} alt="회색 맥주" width={34} height={34} />
                <p className="text-xs text-[#9B9B9B]">
                  {role === RoleEnum.STAFF ||
                  role === RoleEnum.OWNER ||
                  role === RoleEnum.ADMIN
                    ? "주점 관리"
                    : "주점 찾기"}
                </p>
              </>
            )}
          </div>
          <div
            onClick={() => {
              if (
                role === RoleEnum.STAFF ||
                role === RoleEnum.OWNER ||
                role === RoleEnum.ADMIN
              ) {
                router.push("/management/reservation");
                return;
              } else {
                router.push("/reservation-check-page");
              }

              onClickReservationCheck();
            }}
            className="flex h-[54px] w-[60px] flex-col items-center"
          >
            {curPos === "/reservation-check-page" ||
            curPos === "/management/reservation" ? (
              <>
                <Image
                  src={OrangeReservation}
                  alt="오렌지 예약"
                  width={32}
                  height={32}
                />
                <p className="text-xs text-[#FF5940]">
                  {role === RoleEnum.STAFF ||
                  role === RoleEnum.OWNER ||
                  role === RoleEnum.ADMIN
                    ? "예약 관리"
                    : "예약 내역"}
                </p>
              </>
            ) : (
              <>
                <Image
                  src={GrayReservation}
                  alt="회색 예약"
                  width={32}
                  height={32}
                />
                <p className="text-xs text-[#9B9B9B]">
                  {role === RoleEnum.STAFF ||
                  role === RoleEnum.OWNER ||
                  role === RoleEnum.ADMIN
                    ? "예약 관리"
                    : "예약 내역"}
                </p>
              </>
            )}
          </div>
          <div
            onClick={() => {
              router.push("/mypage");
            }}
            className="flex h-[54px] w-[60px] flex-col items-center justify-center"
          >
            {curPos === "/mypage" ? (
              <>
                <Image
                  className="flex justify-center"
                  src={OrangeMypage}
                  alt="마이페이지"
                  width={20}
                  height={20}
                />
                <p className="mt-1 text-xs text-[#FF5940]">마이페이지</p>
              </>
            ) : (
              <>
                <Image
                  src={GrayMypage}
                  alt="마이페이지"
                  width={20}
                  height={20}
                />
                <p className="mt-1 text-xs text-[#9B9B9B]">마이페이지</p>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
