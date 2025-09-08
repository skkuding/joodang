import { cookies } from "next/headers";
import { DetailHeader } from "../components/DetailHeader";
import Image from "next/image";
import Link from "next/link";
import { safeFetcher } from "@/lib/utils";
import type { Notification } from "../type";
import { AuthSheet } from "../components/AuthSheet";

export default async function NotificationPage() {
  const cookieStore = await cookies();
  //const token = cookieStore.get("token")?.value;
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImtha2FvSWQiOiJrYWthb18yMDIwMTIzNDU2IiwiaWF0IjoxNzU2NzE4NzkxLCJleHAiOjE3ODgyNTQ3OTF9.Ulf0QSeLAmh0kFtHwsi9ilM9S2PFFW4cnEkq5PONc1I";
  if (!token) return <p>로그인 에러.</p>;

  const res = await safeFetcher("notification", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const data: Notification[] = await res.json();
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
                  <h2 className="max-w-[180px] text-base font-semibold text-red-500">
                    {item.message}
                  </h2>
                </div>
                <Link href={item.url} passHref>
                  <button className="flex text-xs text-gray-500 hover:underline">
                    <p>상세보기 </p>
                    <Image
                      src="/icons/icon_arrow.svg"
                      alt=">"
                      width={14}
                      height={14}
                    />
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
      )}
    </div>
  );
}
