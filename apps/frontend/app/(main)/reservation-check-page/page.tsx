"use client";

import { AuthSheet } from "@/app/components/AuthSheet";
import { EmptyRecord } from "@/app/components/EmptyRecord";
import { ReservationResponse } from "@/app/type";
import { safeFetcher } from "@/lib/utils";
import Checkbox from "@/public/icons/orangeCheckbox.svg";
import { HTTPError } from "ky";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReservationCard from "./components/ReservationCard";

export default function ReservationCheckPage() {
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [showAuthSheet, setShowAuthSheet] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("preReservation");

  useEffect(() => {
    let cancelled = false;

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

    async function checkLogin(): Promise<boolean> {
      try {
        await safeFetcher("user/me/role").json();
        return true;
      } catch (e) {
        if (e instanceof HTTPError && e.response.status === 401) return false;
        return false;
      }
    }

    async function addMyReservationsByTokens(tokens: string[]) {
      if (!tokens.length) return;
      try {
        const res = await safeFetcher.patch("reservation/token", {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tokens }),
        });
        if (res.ok) {
          try {
            localStorage.removeItem("reservationToken");
          } catch {}
        }
      } catch (e) {}
    }

    async function fetchReservations() {
      const list: ReservationResponse[] =
        await safeFetcher("reservation").json();
      return list;
    }

    async function getReservationsByTokens(tokens: string[]) {
      if (!tokens.length) return [] as ReservationResponse[];
      const params = new URLSearchParams();
      tokens.forEach(t => params.append("reservationTokens", t));
      try {
        const list: ReservationResponse[] = await safeFetcher(
          `reservation/token?${params.toString()}`
        ).json();
        return list;
      } catch (e) {
        return [] as ReservationResponse[];
      }
    }

    (async () => {
      const tokens = readTokensFromLocalStorage();
      const loggedIn = await checkLogin();

      if (loggedIn) {
        await addMyReservationsByTokens(tokens);
        const list = await fetchReservations();
        if (!cancelled) setReservations(list);
      } else {
        const list = await getReservationsByTokens(tokens);
        if (!cancelled) {
          setReservations(list);
          if (!tokens.length || list.length === 0) {
            setShowAuthSheet(true);
          }
        }
      }
      if (!cancelled) setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  interface sectionProps {
    reservations: ReservationResponse[];
    tabValue: string;
  }
  function ReservationCards(props: sectionProps) {
    if (props.reservations.length === 0) {
      return (
        <div className="py-[38px]">
          <EmptyRecord description="현재 예약된 내역이 없어요" />
        </div>
      );
    }

    const filteredList: ReservationResponse[] = [];
    if (props.tabValue === "preReservation") {
      for (const reservation of props.reservations) {
        if (reservation.timeSlot.totalCapacity === -1) {
          continue;
        }
        filteredList.push(reservation);
      }
    } else {
      for (const reservation of props.reservations) {
        if (reservation.timeSlot.totalCapacity !== -1) {
          continue;
        }
        filteredList.push(reservation);
      }
    }

    return (
      <div>
        {filteredList.length !== 0 ? (
          filteredList.map((reservation, idx) => {
            return <ReservationCard key={idx} data={reservation} />;
          })
        ) : (
          <div className="py-[38px]">
            <EmptyRecord description="현재 예약된 내역이 없어요" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-[60px] px-5">
      {showAuthSheet && <AuthSheet />}
      {loading && <span>Loading...</span>}
      <section className="mb-[20px]">
        <Image
          src={Checkbox}
          alt="checkbox"
          width={24}
          height={24}
          className="mb-[2px]"
        />
        <p className="text-color-common-0 font-pretendard mb-2 h-[28px] w-[240px] text-left text-xl font-medium leading-[140%] tracking-[-0.03em]">
          내 예약을 한 눈에 볼 수 있어요
        </p>
        <div className="text-color-neutral-40 font-pretendard text-[14px] font-normal leading-[140%] tracking-[-0.03em]">
          <p>나의 주점 예약 내역을 주당이</p>
          <p>한 눈에 정리해드려요!</p>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center">
        {/* Tabs */}
        <div className="mb-4 flex w-full">
          {[
            { key: "preReservation", label: "사전 예약" },
            { key: "waiting", label: "현장 대기" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(tab.key as "preReservation" | "waiting")
              }
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === tab.key
                  ? "border-primary-normal text-primary-normal border-b-2"
                  : "text-color-neutral-70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="item-center flex flex-col justify-center gap-3">
          {!loading && (
            <ReservationCards
              reservations={reservations}
              tabValue={activeTab}
            />
          )}
        </div>
      </section>
      <div className="h-7" />
    </div>
  );
}
