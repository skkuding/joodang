"use client";
import StoreMap from "@/app/(main)/components/StoreMap";
import CopyAccountModal from "@/app/components/CopyAccountModal";
import { FloatingBottomBar } from "@/app/components/FloatingBottomBar";
import { ReservationResponse, Store, StoreDetail } from "@/app/type";
import { cn, formatToHHMM, formatWithComma, safeFetcher } from "@/lib/utils";
import Arrow from "@/public/icons/icon_arrow.svg";
import Location from "@/public/icons/icon_location.svg";
import Money from "@/public/icons/orangeMoney.svg";
import OrangeDot from "@/public/icons/orange_dot.svg";
import { HTTPError } from "ky";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ReservationCancelModal from "./components/ReservationCancelModal";
import { ReservationCheckPageStoreDetail } from "./components/ReservationCheckPageStoreDetail";

export default function ReservationDetail() {
  const [store, setStore] = useState<Store>({
    id: 1,
    name: "",
    contactInfo: "010-9971-6958",
    description: "",
    college: "",
    organizer: "",
    ownerId: 0,
    imageUrl: "https://joodang.com/store_image.png",
    startTime: new Date().toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
    }),
    endTime: new Date().toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
    }),
    isAvailable: true,
    reservationFee: 0,
    bankCode: "088",
    accountNumber: "010010101-1001010-0000-01",
    accountHolder: "방승현",
    location: "",
    latitude: 0,
    longitude: 0,
    icon: 1,
    totalCapacity: 0,
    festivalId: 0,
  });
  const [storeDetail, setStoreDetail] = useState<StoreDetail | null>(null);

  const params = useParams<{ reservationId: string }>();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [reservation, setReservation] = useState<ReservationResponse | null>(
    null
  );

  useEffect(() => {
    async function checkLogin(): Promise<boolean> {
      try {
        await safeFetcher("user/me/role").json();
        return true;
      } catch (e) {
        if (e instanceof HTTPError && e.response.status === 401) return false;
        return false;
      }
    }

    function readTokensFromLocalStorage(): string[] {
      if (typeof window === "undefined") return [];
      try {
        const raw = localStorage.getItem("reservationToken");
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed.filter(t => typeof t === "string" && t.length > 0);
        }
        return [];
      } catch {
        return [];
      }
    }

    async function fetchReservationById(id: string, tokens?: string[]) {
      let url = `reservation/${id}`;
      if (tokens && tokens.length) {
        const qs = new URLSearchParams();
        tokens.forEach(t => qs.append("reservationTokens", t));
        url += `?${qs.toString()}`;
      }
      return (await safeFetcher(url).json()) as ReservationResponse | null;
    }

    (async () => {
      const loggedIn = await checkLogin();
      const tokens = loggedIn ? [] : readTokensFromLocalStorage();
      try {
        const reservation = await fetchReservationById(
          params.reservationId as string,
          tokens
        );
        if (reservation) {
          setStore(reservation.store);
          setReservation(reservation);
          const fetchedStoreDetail: StoreDetail | null = await safeFetcher(
            `store/${reservation.store.id}`
          ).json();
          if (fetchedStoreDetail) setStoreDetail(fetchedStoreDetail);
        } else if (!loggedIn && !tokens.length) {
        }
      } catch (e) {}
    })();
  }, [params.reservationId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  console.log("reservation", reservation);

  return (
    <div className="bg-color-neutral-99 flex min-h-screen flex-col tracking-[-0.03em]">
      <ReservationCancelModal
        open={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          return;
        }}
        reservationId={reservation ? reservation.id : null}
      />

      {/* 윗 부분 */}
      <div className="bg-color-common-100 mb-[10px] p-5">
        <div>
          <p className="justify-start text-xs font-normal leading-none text-red-500">
            {reservation?.store.college} | {reservation?.store.organizer}
          </p>
          <p className="mb-3 h-7 w-64 justify-start text-xl font-medium leading-7 text-black">
            {reservation?.store.name}
          </p>
        </div>
        <div className="text-color-neutral-40 flex flex-col justify-start gap-1 text-sm font-normal leading-tight">
          <div className="flex">
            <Image
              src={Location}
              alt="위치"
              width={16}
              height={16}
              className="mr-1"
            />
            <div className="flex w-full justify-between">
              <p>위치</p>
              <p className="text-color-neutral-20">
                {reservation?.store.location}
              </p>
            </div>
          </div>
          <div className="flex">
            <object data="/icons/icon_clock.png" className="mr-1 h-4 w-4" />
            <div className="flex w-full justify-between">
              <p>운영 시간</p>
              <p className="text-color-neutral-20">
                {formatToHHMM(reservation ? reservation.store.startTime : "")} ~{" "}
                {formatToHHMM(reservation ? reservation.store.endTime : "")}
              </p>
            </div>
          </div>
          <div className="flex">
            <Image
              src={Money}
              alt="입장료"
              width={16}
              height={16}
              className="mr-1"
            />
            <div className="flex w-full justify-between">
              <p>입장료</p>
              <p className="text-color-neutral-20">
                인당{" "}
                {formatWithComma(
                  reservation ? reservation.store.reservationFee : 0
                )}
                원
              </p>
            </div>
          </div>
        </div>

        <div className="bg-color-neutral-99 mt-2 flex flex-col justify-start space-y-[6px] rounded-md px-4 py-3 text-sm font-normal leading-tight text-zinc-700">
          <div className="flex">
            <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
            <div className="ml-2 flex w-full justify-between">
              <p>주점 연락처</p>
              <p className="text-color-neutral-20">
                {reservation?.store.contactInfo}
              </p>
            </div>
          </div>
          <div className="flex">
            <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
            <div className="ml-2 flex w-full justify-between">
              <p>입금 계좌</p>
              <CopyAccountModal store={store} />
            </div>
          </div>
        </div>
      </div>

      {/* 아랫 부분 */}
      <div className="bg-color-common-100 flex flex-1 flex-col justify-start gap-6 px-5 pt-5 text-base font-normal leading-normal text-zinc-700">
        <ReservationCheckPageStoreDetail reservation={reservation} />
        <div className="flex flex-col">
          <div className="flex">
            <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
            <div className="ml-2 flex w-full justify-between">
              <p>주점 위치</p>
              <Link href={`/map/${reservation?.storeId}`} className="mt-2">
                <div className="relative flex flex-row gap-[2px] pl-[10px]">
                  <p
                    className={cn(
                      "text-color-neutral-40 flex items-center text-xs font-normal",
                      "after:absolute after:-inset-3 after:rounded-full after:content-['']"
                    )}
                  >
                    길찾기
                  </p>
                  <Image src={Arrow} alt="arrow" width={13} height={13} />
                </div>
              </Link>
            </div>
          </div>
          <div className="h-[215px] w-full overflow-hidden rounded-md">
            <StoreMap stores={[store]} current={0} />
          </div>
        </div>
        <div className="h-[125px]" />

        <FloatingBottomBar>
          <button
            className="h-11 w-full rounded-md bg-[#FF5940] text-sm font-medium text-white"
            onClick={() => {
              setIsModalVisible(true);
            }}
          >
            {reservation?.timeSlot.totalCapacity === -1
              ? "현장 대기 취소"
              : "예약 취소"}
          </button>
        </FloatingBottomBar>
      </div>
    </div>
  );
}
