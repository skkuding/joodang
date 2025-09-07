"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { safeFetcher } from "@/lib/utils";
import kakaoIcon from "@/public/icons/icon_kakao.svg";
import logoSymbol from "@/public/logo_symbol.svg";
import logoText from "@/public/logo_text.svg";
import { Button } from "@/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
export function AuthSheet() {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await safeFetcher.get("user/me/role").json();
      } catch {
        setIsSheetOpen(true);
      }
    };

    checkAuth();
  }, []);
  return (
    <Sheet
      open={isSheetOpen}
      onOpenChange={open => {
        if (!open) {
          if (window.history.length > 1) router.back();
          else router.push("/");
          return;
        }
        setIsSheetOpen(open);
      }}
    >
      <SheetContent side="bottom" className="h-5/6 rounded-t-2xl">
        <SheetHeader>
          <SheetTitle className="hidden" />
        </SheetHeader>
        <div className="flex h-full flex-col items-center justify-center px-5">
          <div className="mb-4 flex gap-[5.54px]">
            <Image src={logoSymbol} alt="Logo Symbol" />
            <Image src={logoText} alt="Logo Text" />
          </div>
          <p className="mb-10 text-center">
            간편하게 로그인하고 <br />
            다양한 서비스를 이용해보세요
          </p>
          <Button
            className="h-[55px] w-full rounded bg-[#fee500] text-black"
            onClick={() => {
              const { pathname, search, hash } = window.location;
              const returnTo = encodeURIComponent(
                `${pathname}${search || ""}${hash || ""}`
              );
              window.location.href = `https://api.joodang.com/auth/kakao?returnTo=${returnTo}`;
            }}
          >
            <Image src={kakaoIcon} alt="Kakao Icon" />
            <span>카카오 로그인/회원가입</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
