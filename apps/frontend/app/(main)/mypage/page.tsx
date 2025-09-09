"use client";

import { AuthSheet } from "@/app/components/AuthSheet";
import { User } from "@/app/type";
import { Button } from "@/components/ui/button";
import { safeFetcher } from "@/lib/utils";
import arrowIcon from "@/public/icons/icon_arrow.svg";
import defaultProfileIcon from "@/public/icons/icon_default_profile.svg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Separator } from "../components/Separator";
import { RequestRoleButton } from "./components/RequestRoleButton";

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [openAuthSheet, setOpenAuthSheet] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user: User = await safeFetcher.get("user/me").json();
        setUser(user);
      } catch {}
    };
    fetchUser();
  }, []);

  const handleAuth = () => {
    if (user) {
      safeFetcher.post("auth/logout").then(() => {
        setUser(null);
        window.location.reload();
      });
    } else {
      setOpenAuthSheet(true);
    }
  };

  function Profile() {
    return (
      <div className="flex gap-3 p-5">
        <Image src={defaultProfileIcon} alt="Default Profile" />
        <div className="flex w-full flex-col">
          <div className="flex justify-between">
            <span className="text-xl font-semibold">
              {user ? user.name : "로그인하세요"}
            </span>
            <div className="flex items-center">
              <Button
                variant={"ghost"}
                className="flex h-3 gap-[2px]"
                onClick={handleAuth}
              >
                <span className="text-color-neutral-40 text-xs font-normal">
                  {user ? "로그아웃" : "로그인"}
                </span>
                <Image src={arrowIcon} alt="Arrow Icon" width={15} />
              </Button>
            </div>
          </div>
          <span className="text-color-neutral-60 text-sm font-normal">
            {user?.role === "ADMIN"
              ? "관리자"
              : user?.role === "OWNER"
                ? "주점 운영자"
                : user?.role === "USER"
                  ? "일반 사용자"
                  : "비회원"}
          </span>
        </div>
      </div>
    );
  }

  function Settings() {
    return (
      <div className="flex flex-col p-[30px] text-sm font-medium">
        <p className="text-color-neutral-70 text-sm font-medium">문의하기</p>
        <Button
          variant={"ghost"}
          onClick={() => (window.location.href = "/faq")}
        >
          <div className="flex w-full justify-between">
            <span className="text-base font-medium">FAQ</span>
            <Image src={arrowIcon} alt="Arrow Icon" width={15} />
          </div>
        </Button>
        <Button variant={"ghost"}>
          <a href="mailto:ask@joodang.com" className="w-full">
            <div className="flex justify-between">
              <span className="text-base font-medium">운영자 1:1 문의</span>
              <Image src={arrowIcon} alt="Arrow Icon" width={15} />
            </div>
          </a>
        </Button>
        {user && <RequestRoleButton user={user} />}
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <AuthSheet
        open={openAuthSheet}
        onOpenChange={setOpenAuthSheet}
        closeToHistory={false}
      />
      <Profile />
      <Separator />
      <Settings />
    </div>
  );
}
