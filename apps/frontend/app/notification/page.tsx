import { cookies } from "next/headers";
import { DetailHeader } from "../components/DetailHeader";
import Image from "next/image";
import { safeFetcher } from "@/lib/utils";
import type { Notification } from "../type";
import { AuthSheet } from "../components/AuthSheet";
import NotiCard from "./_components/NotiCard";

export default async function NotificationPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImtha2FvSWQiOiJrYWthb18yMDIwMTIzNDU2IiwiaWF0IjoxNzU2NzE4NzkxLCJleHAiOjE3ODgyNTQ3OTF9.Ulf0QSeLAmh0kFtHwsi9ilM9S2PFFW4cnEkq5PONc1I";
  //if (!token) return <p>로그인 에러.</p>;

  let data: Notification[] = [];

  // 토큰이 있을 때만 API 호출
  if (token) {
    try {
      const res = await safeFetcher("notification", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });
      data = await res.json();
    } catch (error) {
      // 401이나 다른 에러가 발생해도 빈 배열로 처리
      console.log("알림 조회 실패:", error);
      data = [];
    }
  }

  console.log("notification data", data);
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <AuthSheet />
      <DetailHeader />
      {data.length === 0 ? (
        <div className="mt-40 flex flex-col items-center justify-center space-y-3 p-5">
          <Image
            src="/icons/icon_orange_noti.svg"
            alt="No Notifications"
            width={80}
            height={80}
          />
          <h2 className="text-lg font-semibold text-gray-700">
            새로운 알림이 없습니다.
          </h2>
        </div>
      ) : (
        <div className="mt-[30px] flex flex-col items-center space-y-3 p-5">
          {data.map(item => (
            <NotiCard key={item.id} noti={item} />
          ))}
        </div>
      )}
    </div>
  );
}
