"use client";
import StoreMap from "@/app/(main)/components/StoreMap";
import CopyAccountModal from "@/app/components/CopyAccountModal";
import { FloatingBottomBar } from "@/app/components/FloatingBottomBar";
import { ReservationResponse, Store, StoreDetail } from "@/app/type";
import { BankCodes } from "@/constant";
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
import { Button } from "@/ui/button";
import arrowIcon from "@/public/icons/icon_arrow.svg";

function StatusBadge({ reservation }: { reservation: ReservationResponse }) {
  const base = "rounded px-2 py-1 text-xs font-medium";
  if (reservation.isConfirmed === true) {
    return (
      <span className={`${base} text-primary-normal bg-red-50`}>예약 확정</span>
    );
  }
  if (reservation.isConfirmed === false) {
    return (
      <span className={`${base} bg-color-neutral-99 text-color-neutral-70`}>
        예약 반려
      </span>
    );
  }
  return (
    <span className={`${base} bg-color-neutral-99 text-color-neutral-70`}>
      미정
    </span>
  );
}

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
  const [amount, setAmount] = useState<number | null>(null);
  const [bankName, setBankName] = useState<string | null>(null);

  // 예약 정보 기반 송금 금액/은행명 계산
  useEffect(() => {
    if (reservation?.store.reservationFee && reservation?.headcount) {
      setAmount(reservation.store.reservationFee * reservation.headcount);
      setBankName(BankCodes[reservation.store.bankCode] ?? null);
    }
  }, [reservation]);

  // 계좌번호 복사 (은행명 포함)
  const copyAccountToClipboard = async () => {
    const text =
      `${bankName ?? ""} ${reservation?.store.accountNumber ?? ""}`.trim();
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      // toast.success("계좌번호가 복사되었습니다");
    } catch {
      // Fallback (일부 iOS/Safari/PWA)
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand("copy");
        // toast.success("계좌번호가 복사되었습니다");
      } catch {
        // toast.error("복사에 실패했습니다");
      } finally {
        document.body.removeChild(ta);
      }
    }
  };

  // 송금 핸들러들
  const handleTossPayment = async () => {
    const tossAppUrl = `supertoss://send?bank=${bankName ?? ""}&accountNo=${reservation?.store.accountNumber ?? ""}`;
    const tossWebUrl = "https://toss.me";
    await copyAccountToClipboard();
    if (
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      window.location.href = tossAppUrl;
    } else {
      window.open(tossWebUrl, "_blank");
    }
  };

  const handleKakaoPayment = async () => {
    const kakaoPayUrl = `https://link.kakaopay.com/t/money/to/bank?bank_code=${reservation?.store.bankCode ?? ""}&bank_account_number=${reservation?.store.accountNumber ?? ""}`;
    await copyAccountToClipboard();
    if (
      /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      window.location.href = kakaoPayUrl;
    } else {
      window.open(kakaoPayUrl, "_blank");
    }
  };

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

    // (이전 내부 SendMoneyButton 정의 제거)

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
          <div className="mb-3 flex h-6 justify-between">
            <p className="h-7 w-64 justify-start text-xl font-medium leading-7 text-black">
              {reservation?.store.name}
            </p>
            {reservation && <StatusBadge reservation={reservation} />}
          </div>
        </div>
        <div className="text-color-neutral-40 flex flex-col justify-start gap-1 py-5 text-sm font-normal leading-tight">
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

        <div className="flex w-full flex-col rounded-md px-2 py-3 text-sm shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
          <div className="bg-color-neutral-99 rounded-md px-3 py-2">
            <div className="flex w-full flex-col justify-between">
              <div className="flex">
                <Image src={OrangeDot} alt="주황닷" width={6} height={6} />
                <div className="ml-2 flex w-full justify-between">
                  <p>주점 연락처</p>
                  <p className="text-color-neutral-20">
                    {reservation?.store.contactInfo}
                  </p>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
                  <span>입금 계좌</span>
                </div>
                {<CopyAccountModal store={store} />}
              </div>
            </div>
          </div>
          <Button
            variant={"ghost"}
            className="flex !h-14 justify-between !px-0"
            onClick={handleTossPayment}
          >
            <div className="flex gap-2">
              <object data="/icons/icon_toss.png" width={61} height={24} />
              <span>토스로 송금하기</span>
            </div>
            <Image src={arrowIcon} alt="arrow" />
          </Button>
          <Button
            variant={"ghost"}
            className="flex !h-5 justify-between !px-0"
            onClick={handleKakaoPayment}
          >
            <div className="flex gap-2">
              <div className="w-[61px]">
                <object
                  data="/icons/icon_kakao_pay.png"
                  width={61}
                  height={24}
                />
              </div>
              <span>카카오페이로 송금하기</span>
            </div>
            <Image src={arrowIcon} alt="arrow" />
          </Button>
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
