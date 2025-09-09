import Image from "next/image";
import { cookies } from "next/headers";
import arrowIcon from "@/public/icons/icon_arrow.svg";
import defaultProfileIcon from "@/public/icons/icon_default_profile.svg";
import { Separator } from "../components/Separator";
import { RequestRoleButton } from "./components/RequestRoleButton";
import { AuthControls } from "./components/AuthControls";
import Link from "next/link";
import { User } from "@/app/type";
import { safeFetcher } from "@/lib/utils";

async function getUser() {
  const cookieHeader = cookies().toString();

  try {
    const res = await safeFetcher("user/me", {
      headers: {
        cookie: cookieHeader,
      },
    }).json();
    return res as Partial<User>;
  } catch {
    return null;
  }
}

export default async function Page() {
  const user = await getUser();

  const roleText =
    user?.role === "ADMIN"
      ? "관리자"
      : user?.role === "OWNER"
        ? "주점 운영자"
        : user?.role === "USER"
          ? "일반 사용자"
          : "비회원";

  return (
    <div className="flex flex-col">
      <div className="flex gap-3 p-5">
        <Image src={defaultProfileIcon} alt="Default Profile" />
        <div className="flex w-full flex-col">
          <div className="flex justify-between">
            <span className="text-xl font-semibold">
              {user ? user.name : "로그인하세요"}
            </span>
            <AuthControls loggedIn={!!user} />
          </div>
          <span className="text-color-neutral-60 text-sm font-normal">
            {roleText}
          </span>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col p-[30px] text-sm font-medium">
        <p className="text-color-neutral-70 text-sm font-medium">문의하기</p>
        <Link href="/faq" className="w-full">
          <div className="flex w-full justify-between py-2">
            <span className="text-base font-medium">FAQ</span>
            <Image src={arrowIcon} alt="Arrow Icon" width={15} />
          </div>
        </Link>
        <a href="mailto:ask@joodang.com" className="w-full">
          <div className="flex justify-between py-2">
            <span className="text-base font-medium">운영자 1:1 문의</span>
            <Image src={arrowIcon} alt="Arrow Icon" width={15} />
          </div>
        </a>
        {user && <RequestRoleButton user={user} />}
      </div>
    </div>
  );
}
