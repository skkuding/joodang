"use client";
import BlackBeer from "@/icons/blackBeer.png";
import BlackHouse from "@/icons/blackHouse.png";
import GrayBeer from "@/icons/grayBeer.png";
import GrayHouse from "@/icons/grayHouse.png";
import Image from "next/image";
import { useState } from "react";
import { requestPermissionAndSubscribe } from "@/lib/push-subscription";

export function Footer() {
  const [page, setPage] = useState("home");
  const onClickBeer = async () => {
    setPage("beer");
    try {
      await requestPermissionAndSubscribe();
    } catch (e) {
      console.error("푸시 구독 실패:", e);
    }
  };

  return (
    <div
      className="fixed left-0 right-0 bottom-0 z-50 w-full bg-white h-20 flex items-center justify-center"
      style={{ boxShadow: "0 -2px 8px rgba(0,0,0,0.1)" }}
    >
      <div className="flex flex-row justify-center gap-[60px] -mt-2">
        <div
          onClick={() => setPage("home")}
          className="w-[60px] h-[54px] flex flex-col items-center"
        >
          {page === "home" ? (
            <>
              <Image src={BlackHouse} alt="검은 집" width={32} height={32} />
              <p className="text-black ">홈</p>
            </>
          ) : (
            <>
              <Image src={GrayHouse} alt="회색 집" width={32} height={32} />
              <p className="text-[#9B9B9B]">홈</p>
            </>
          )}
        </div>
        <div
          onClick={onClickBeer}
          className="w-[60px] h-[54px] flex flex-col items-center"
        >
          {page === "beer" ? (
            <>
              <Image src={BlackBeer} alt="검은 맥주" width={32} height={32} />
              <p className="text-black ">주점 찾기</p>
            </>
          ) : (
            <>
              <Image src={GrayBeer} alt="회색 맥주" width={32} height={32} />
              <p className="text-[#9B9B9B]">주점 찾기</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
