import { cookies } from "next/headers";
import { DetailHeader } from "../components/DetailHeader";
import Image from "next/image";
import Link from "next/link";
import { safeFetcher } from "@/lib/utils";
import type { Notification } from "../type";

export default async function NotificationPage() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("token")?.value ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIsImtha2FvSWQiOiJrYWthb18yMDIwNDU2Nzg5IiwiaWF0IjoxNzU2NzE4NzkxLCJleHAiOjE3ODgyNTQ3OTF9.LvRMHSBqDiqDMrxgxKRbj3AvcJJkXekKJrckQaLLS1E";
  const res = await safeFetcher("notification", {
    headers: {
      Cookie: `token=${token}`,
    },
    cache: "no-store", // 최신 데이터
  });
  const data: Notification[] = await res.json();
  console.log("notification data", data);
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <DetailHeader />

      <div className="mt-[30px] flex flex-col items-center space-y-3 p-5">
        {data.map(item => (
          <div
            key={item.id}
            className="w-[335px] rounded-2xl border-0 bg-white p-4 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image
                  src="/icons/icon_orange_noti.svg"
                  alt="Notification Icon"
                  width={24}
                  height={24}
                />
                <h2 className="text-base font-semibold text-red-500">
                  {item.message}
                </h2>
              </div>
              <Link href={item.url} passHref>
                <button className="text-xs text-gray-500 hover:underline">
                  <p>내 예약 보기</p>
                </button>
              </Link>
            </div>

            {item.type !== "Reservation" ? (
              <div className="mt-2 flex flex-col gap-2 whitespace-pre-line rounded-md bg-[#f5f5f5] p-2 text-sm text-gray-700">
                <div className="flex justify-between">
                  <div className="flex gap-1">
                    <Image
                      src="icons/icon_gray_coloredHouse.svg"
                      alt="Store Icon"
                      width={16}
                      height={16}
                      className="mr-1 inline-block"
                    />
                    <p>주점명</p>
                  </div>
                  <p>{item.title}</p>
                </div>
                {/* <div className="flex justify-between">
                  <div className="flex gap-1">
                    <Image
                      src="icons/icon_gray_location.svg"
                      alt="Location Icon"
                      width={16}
                      height={16}
                      className="mr-1 inline-block"
                    />
                    <p>위치</p>
                  </div>
                  <p>{item.location}</p>
                </div> */}
              </div>
            ) : (
              ""
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
