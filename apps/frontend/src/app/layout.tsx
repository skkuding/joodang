"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BlackBeer from "@/icons/blackBeer.png";
import BlackHouse from "@/icons/blackHouse.png";
import BlackReserv from "@/icons/blackReserv.svg";
import GrayBeer from "@/icons/grayBeer.png";
import GrayHouse from "@/icons/grayHouse.png";
import GrayReserv from "@/icons/reserv.svg";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "주당",
  description: "대학 축제 주점 예약 플랫폼",
  icons: {
    icon: "/icon.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [page, setPage] = useState("home");
  return (
    <html lang="en">
      <header>
        <div className="fixed left-0 right-0 top-0 w-full px-5 flex bg-white h-[68px] items-end ">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex gap-1 items-center">
              <span className="text-xl font-semibold">성균관대학교</span>
              <IoIosArrowDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>성균관대학교</DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <Script
        type="text/javascript"
        src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_ID}&submodules=geocoder`}
      />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pt-[48px] pb-20`}
      >
        {children}
      </body>
      <footer>
        <div
          className="fixed left-0 right-0 bottom-0 z-50 w-full bg-white h-20 flex items-center justify-center"
          style={{ boxShadow: "0 -2px 8px rgba(0,0,0,0.1)" }}
        >
          <div className="flex flex-row justify-center gap-[60px] -mt-2">
            <div
              onClick={() => {
                setPage("home");
                router.push("/");
              }}
              className="w-[60px] h-[54px] flex flex-col items-center"
            >
              {page === "home" ? (
                <>
                  <Image
                    src={BlackHouse}
                    alt="검은 집"
                    width={32}
                    height={32}
                  />
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
              onClick={() => {
                setPage("beer");
                router.push("/barPage");
              }}
              className="w-[60px] h-[54px] flex flex-col items-center"
            >
              {page === "beer" ? (
                <>
                  <Image
                    src={BlackBeer}
                    alt="검은 맥주"
                    width={32}
                    height={32}
                  />
                  <p className="text-black ">주점 찾기</p>
                </>
              ) : (
                <>
                  <Image
                    src={GrayBeer}
                    alt="회색 맥주"
                    width={32}
                    height={32}
                  />
                  <p className="text-[#9B9B9B]">주점 찾기</p>
                </>
              )}
            </div>
            <div
              onClick={() => setPage("reservation")}
              className="w-[60px] h-[54px] flex flex-col items-center"
            >
              {page === "reservation" ? (
                <>
                  <Image src={BlackReserv} alt="예약" width={32} height={32} />
                  <p className="text-black ">예약 내역</p>
                </>
              ) : (
                <>
                  <Image
                    src={GrayReserv}
                    alt="회색 예약"
                    width={32}
                    height={32}
                  />
                  <p className="text-[#9B9B9B]">예약 내역</p>
                </>
              )}
            </div>
          </div>
        </div>
      </footer>
    </html>
  );
}
