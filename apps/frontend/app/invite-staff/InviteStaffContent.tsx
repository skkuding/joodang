"use client";
import kakaoIcon from "@/public/icons/icon_kakao.svg";
import beersIcon from "@/public/icons/icon_orange_beers.svg";
import logoSymbol from "@/public/logo_symbol.svg";
import logoText from "@/public/logo_text.svg";
import { Button } from "@/ui/button";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { FloatingBottomBar } from "../components/FloatingBottomBar";

export default function InviteStaffContent() {
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get("code"); // "coinviteCodede" 오타 수정

  useEffect(() => {
    if (inviteCode) {
      localStorage.setItem("inviteCode", inviteCode);
    }
  }, [inviteCode]);

  return (
    <div className="fixed bottom-0 left-0 right-0 flex h-full flex-col items-center justify-center px-5">
      <div className="fixed top-10 flex gap-[4.75px]">
        <Image src={logoSymbol} alt="Logo Symbol" />
        <Image src={logoText} alt="Logo Text" />
      </div>
      <div className="flex flex-col items-center gap-3">
        <Image src={beersIcon} alt="Beers Icon" className="h-[90px] w-[90px]" />
        <p className="mb-3 text-center text-xl font-semibold">
          주당에서 로그인하고 <br />
          서브 운영자가 되어보세요!
        </p>
        <p className="text-color-neutral-30 text-sm font-normal">
          주당은 당신의 도움을 필요로 해요
        </p>
      </div>
      <FloatingBottomBar>
        <Button
          className="h-[55px] w-full rounded bg-[#fee500] text-black"
          onClick={() => {
            window.location.href = `https://api.joodang.com/auth/kakao`;
          }}
        >
          <Image src={kakaoIcon} alt="Kakao Icon" />
          <span>카카오 로그인/회원가입</span>
        </Button>
      </FloatingBottomBar>
    </div>
  );
}
