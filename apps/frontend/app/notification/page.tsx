import { DetailHeader } from "../components/DetailHeader";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/ui/button";

const dummyData = [
  {
    storeId: 1,
    storeName: "모태솔로지만 연애는 하고싶어",
    id: 4,
    notificationId: 4,
    title: "예약한 시간이 되었어요!",
    message:
      "주점명: 모태솔로지만 연애는 하고싶어\n예약 시간: 14:00 ~ 16:00\n위치: 경영관 테라스",
    url: "https://example.com/reservation/123",
    type: "RESERVATION_START",
    isRead: false,
    createTime: "2025-09-04T14:00:00.000Z",
    location: "디도 앞 잔디밭",
    startTime: "2026-01-01T18:00:00.000Z",
    endTime: "2026-01-01T20:00:00.000Z",
  },
  {
    storeId: 1,
    storeName: "모태솔로지만 연애는 하고싶어",
    id: 3,
    notificationId: 3,
    title: "예약 시간 5분 전이에요!",
    message:
      "주점명: 모태솔로지만 연애는 하고싶어\n예약 시간: 14:00 ~ 16:00\n위치: 경영관 테라스",
    url: "https://example.com/reservation/123",
    type: "RESERVATION_REMINDER_5M",
    isRead: true,
    createTime: "2025-09-04T13:55:00.000Z",
    location: "디도 앞 잔디밭",
    startTime: "2026-01-01T18:00:00.000Z",
    endTime: "2026-01-01T20:00:00.000Z",
  },
  {
    storeId: 1,
    storeName: "모태솔로지만 연애는 하고싶어",
    id: 2,
    notificationId: 2,
    title: "예약 시간 10분 전이에요!",
    message:
      "주점명: 모태솔로지만 연애는 하고싶어\n예약 시간: 14:00 ~ 16:00\n위치: 경영관 테라스",
    url: "https://example.com/reservation/123",
    type: "RESERVATION_REMINDER_10M",
    isRead: true,
    createTime: "2025-09-04T13:50:00.000Z",
    location: "디도 앞 잔디밭",
    startTime: "2026-01-01T18:00:00.000Z",
    endTime: "2026-01-01T20:00:00.000Z",
  },
  {
    storeId: 1,
    storeName: "모태솔로지만 연애는 하고싶어",
    id: 1,
    notificationId: 1,
    title: "예약이 확정되었어요",
    message:
      "주점명: 모태솔로지만 연애는 하고싶어\n예약 시간: 14:00 ~ 16:00\n위치: 경영관 테라스",
    url: "https://example.com/reservation/123",
    type: "RESERVATION_CONFIRMED",
    isRead: true,
    createTime: "2025-09-03T10:00:00.000Z",
    location: "디도 앞 잔디밭",
    startTime: "2026-01-01T18:00:00.000Z",
    endTime: "2026-01-01T20:00:00.000Z",
  },
];

export default function NotificationPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <DetailHeader />

      <div className="mt-[30px] flex flex-col items-center space-y-3 p-5">
        {dummyData.map(item => (
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
                  {item.title}
                </h2>
              </div>
              <Link href="/reservation-check-page" passHref>
                <button className="text-xs text-gray-500 hover:underline">
                  <p>내 예약 보기</p>
                </button>
              </Link>
            </div>

            {item.type !== "RESERVATION_CONFIRMED" ? (
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
                  <p>{item.storeName}</p>
                </div>
                <div className="flex justify-between">
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
                </div>
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
