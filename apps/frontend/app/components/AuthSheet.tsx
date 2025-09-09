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

interface AuthSheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeToHistory?: boolean; // true: 이전 화면으로 이동, false: Sheet만 닫기
}

export function AuthSheet({
  open,
  onOpenChange,
  closeToHistory = true,
}: AuthSheetProps) {
  const router = useRouter();

  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;
  const actualOpen = isControlled ? open : internalOpen;
  const handleOpenChange = isControlled ? onOpenChange : setInternalOpen;

  useEffect(() => {
    // open prop이 명시적으로 전달된 경우 인증 체크를 하지 않음
    if (open !== undefined) {
      return;
    }

    const checkAuth = async () => {
      try {
        await safeFetcher.get("user/me/role").json();
      } catch {
        handleOpenChange(true);
      }
    };
    checkAuth();
  }, [open, handleOpenChange]);

  return (
    <Sheet
      open={actualOpen}
      onOpenChange={open => {
        if (!open) {
          if (closeToHistory) {
            if (window.history.length > 1) router.back();
            else router.push("/");
            return;
          }
          // closeToHistory가 false인 경우 Sheet만 닫기
        }
        handleOpenChange(open);
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
            className="h-[55px] w-full rounded bg-[#fee500] text-black hover:bg-[#fee500]"
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
