"use client";
import notiIcon from "@/public/icons/notification.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import { requestPermissionAndSubscribe } from "@/lib/push-subscription";

export function Header() {
  const router = useRouter();
  return (
    <div className="z-1 fixed left-0 right-0 top-0 flex h-[94px] w-full justify-between bg-white px-5 pb-4 pt-[50px]">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-1">
          <span className="text-xl font-semibold">성균관대학교</span>
          <IoIosArrowDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>성균관대학교</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
      <Image
        src={notiIcon}
        alt="Notification"
        onClick={async () => {
          router.push("/notification");
          try {
            await requestPermissionAndSubscribe();
          } catch (e) {
            console.error("푸시 구독 실패:", e);
          }
        }}
      />
    </div>
  );
}
