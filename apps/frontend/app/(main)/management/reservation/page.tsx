"use client";

import { useState, useEffect } from "react";
import ReservationFilterDrawer from "./_components/ReservationFilterDrawer";
import ReservationListItem from "./_components/ReservationListItem";
import { getStoreReservations } from "@/lib/api/reservation";
import { getMyOwnedStores } from "@/lib/api/store";
import { formatDateWithDay } from "@/lib/utils";

import Checkbox from "@/public/icons/orangeCheckbox.svg";
import Image from "next/image";
import { ReservationResponse } from "@/app/type";

interface FilterData {
  storeId: number;
  storeName: string;
  date: string;
}

export default function ReservationManagementPage() {
  const [activeTab, setActiveTab] = useState<"all" | "confirmed" | "waiting">(
    "all"
  );
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filterData, setFilterData] = useState<FilterData>({
    storeId: 0,
    storeName: "주점을 선택해주세요",
    date: "날짜를 선택해주세요",
  });
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (filterData.storeId) return;
        const stores = await getMyOwnedStores();
        if (cancelled) return;
        if (stores && stores.length > 0) {
          const first = stores[0];
          const today = new Date();
          setFilterData({
            storeId: first.id,
            storeName: first.name,
            date: formatDateWithDay(today),
          });
        }
      } catch (e) {}
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 예약 목록 로드
  const loadReservations = async () => {
    if (!filterData.storeId) return;

    setLoading(true);
    setError(null);

    try {
      const filters = {
        isConfirmed: activeTab === "confirmed" ? true : undefined,
        isWalkIn: activeTab === "waiting" ? true : undefined,
      };

      const data = await getStoreReservations(filterData.storeId, filters);
      setReservations(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "예약 목록을 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  // 탭 변경 시 예약 목록 다시 로드
  useEffect(() => {
    loadReservations();
  }, [activeTab, filterData.storeId]);

  // 선택 날짜 문자열을 Date로 파싱 (예: 2025년 09월 11일 (목))
  const parseSelectedDate = (value: string): Date | null => {
    if (!value || value.startsWith("0000")) return null;
    const match = value.match(/(\d{4}).*?(\d{1,2}).*?(\d{1,2})/);
    if (!match) return null;
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (!year || !month || !day) return null;
    return new Date(year, month - 1, day);
  };

  const selectedDate = parseSelectedDate(filterData.date);

  const filteredReservations = reservations.filter(reservation => {
    const slotDate = new Date(reservation.timeSlot.startTime);
    const matchesSelectedDate = selectedDate
      ? slotDate.getFullYear() === selectedDate.getFullYear() &&
        slotDate.getMonth() === selectedDate.getMonth() &&
        slotDate.getDate() === selectedDate.getDate()
      : true;

    if (activeTab === "all") {
      return reservation.timeSlot.totalCapacity !== -1 && matchesSelectedDate;
    }
    if (activeTab === "confirmed") {
      return (
        reservation.timeSlot.totalCapacity !== -1 &&
        reservation.isConfirmed === true &&
        matchesSelectedDate
      );
    }
    return reservation.timeSlot.totalCapacity === -1;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-6">
        <Image src={Checkbox} alt="Checkbox" width={18} height={18} />
        <h1 className="mt-1 text-xl font-medium">
          예약자를 한 번에 관리하세요
        </h1>
        <p className="text-color-neutral-40 mt-2 text-sm">
          나의 주점 예약 내역을 주당이
          <br />한 눈에 정리해드려요!
        </p>

        {/* Filter Card */}
        <div className="my-4 rounded-lg bg-white p-5 shadow-[0_0_20px_0_rgba(0,0,0,0.08)]">
          <div className="space-y-3">
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary-normal h-1.5 w-1.5 rounded-full"></div>
                <span className="text-sm text-gray-600">주점명</span>
              </div>
              <span className="text-color-neutral-70 text-sm">
                {filterData.storeName}
              </span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-primary-normal h-1.5 w-1.5 rounded-full"></div>
                <span className="text-sm text-gray-600">날짜</span>
              </div>
              <span className="text-color-neutral-70 text-sm">
                {filterData.date}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="bg-primary-normal mt-4 w-full rounded-lg py-3 font-medium text-white"
          >
            필터 설정하기
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { key: "all", label: "전체 예약" },
            { key: "confirmed", label: "확정 예약" },
            { key: "waiting", label: "현장 대기" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(tab.key as "all" | "confirmed" | "waiting")
              }
              className={`flex-1 py-3 text-sm font-medium ${
                activeTab === tab.key
                  ? "border-primary-normal text-primary-normal border-b-2"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reservation List */}
      <div className="px-4 pb-20">
        {loading && (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">예약 목록을 불러오는 중...</div>
          </div>
        )}

        {error && (
          <div className="flex justify-center py-8">
            <div className="text-primary-normal">{error}</div>
          </div>
        )}

        {!loading && !error && filteredReservations.length === 0 && (
          <div className="flex justify-center py-8">
            <div className="text-gray-500">예약이 없습니다.</div>
          </div>
        )}

        {!loading &&
          !error &&
          filterData.storeId !== 0 &&
          filteredReservations.map(reservation => (
            <ReservationListItem
              key={reservation.id}
              reservation={reservation}
              compact={activeTab === "waiting"}
            />
          ))}
      </div>

      {/* Filter Modal */}
      <ReservationFilterDrawer
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filterData={filterData}
        onApplyFilter={setFilterData}
      />
    </div>
  );
}
