"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthSheet } from "@/app/components/AuthSheet";
import Image from "next/image";
import arrowIcon from "@/public/icons/icon_arrow.svg";

export function AuthControls({ loggedIn }: { loggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleClick = async () => {
    if (loggedIn) {
      await fetch("/auth/logout", { method: "POST", credentials: "include" });
      router.refresh();
    } else {
      setOpen(true);
    }
  };

  return (
    <div className="flex items-center">
      <Button
        variant="ghost"
        className="flex h-3 gap-[2px]"
        onClick={handleClick}
      >
        <span className="text-color-neutral-40 text-xs font-normal">
          {loggedIn ? "로그아웃" : "로그인"}
        </span>
        <Image src={arrowIcon} alt="Arrow Icon" width={15} />
      </Button>
      <AuthSheet open={open} onOpenChange={setOpen} closeToHistory={false} />
    </div>
  );
}
