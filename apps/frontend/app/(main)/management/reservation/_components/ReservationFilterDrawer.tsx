"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { getMyManagedStores, getStoreTimeSlots } from "@/lib/api/store";
import { Store, TimeSlot } from "@/app/type";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { formatDateWithDay, dateFormatter, cn } from "@/lib/utils";

interface FilterData {
  storeId: number;
  storeName: string;
  date: string;
}

interface ReservationFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filterData: FilterData;
  onApplyFilter: (data: FilterData) => void;
}

export default function ReservationFilterDrawer({
  isOpen,
  onClose,
  filterData,
  onApplyFilter,
}: ReservationFilterDrawerProps) {
  const [localFilterData, setLocalFilterData] = useState(filterData);
  const [selectedDate, setSelectedDate] = useState("");
  const [stores, setStores] = useState<Store[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showStoreDropdown, setShowStoreDropdown] = useState(false);
  const [storeDateRangeLabel, setStoreDateRangeLabel] = useState<string>("");
  const [storeIdToRange, setStoreIdToRange] = useState<Record<number, string>>(
    {}
  );

  // 스토어 목록 로드 및 초기화
  useEffect(() => {
    if (isOpen) {
      // 기존 필터 데이터로 먼저 반영
      setLocalFilterData(filterData);
      setSelectedDate(filterData.date);
      setAvailableDates([]);
      setStoreDateRangeLabel("");
      // 사전 선택된 스토어 기준으로 날짜 목록 로드
      loadStores(filterData.storeId);
    }
  }, [isOpen, filterData]);

  const loadStores = async (preselectedStoreId?: number) => {
    setLoading(true);
    try {
      const data = await getMyManagedStores();
      setStores(data);
      // 각 스토어별 기간 라벨 선계산
      try {
        const entries = await Promise.all(
          data.map(async store => {
            const slots = await getStoreTimeSlots(store.id);
            if (slots.length === 0) return [store.id, ""] as const;
            const sorted = [...slots].sort(
              (a: TimeSlot, b: TimeSlot) =>
                new Date(a.startTime).getTime() -
                new Date(b.startTime).getTime()
            );
            const first = new Date(sorted[0].startTime);
            const last = new Date(sorted[sorted.length - 1].startTime);
            const label = `${dateFormatter(first, "YYYY. MM. DD")} ~ ${dateFormatter(
              last,
              "YYYY. MM. DD"
            )}`;
            return [store.id, label] as const;
          })
        );
        setStoreIdToRange(Object.fromEntries(entries));
      } catch (e) {
        console.error("스토어별 기간 라벨 계산 실패:", e);
      }

      // 최초 주점을 0번째로 디폴트 선택
      if (data.length > 0 && localFilterData.storeId === 0) {
        const firstStore = data[0];
        setLocalFilterData({
          ...localFilterData,
          storeId: firstStore.id,
          storeName: firstStore.name,
        });
        // 첫 번째 스토어의 날짜 목록도 로드
        await loadAvailableDates(firstStore.id);
      } else if (preselectedStoreId && preselectedStoreId > 0) {
        // 이미 선택된 스토어가 있으면 해당 스토어 날짜 즉시 로드
        await loadAvailableDates(preselectedStoreId);
      }
    } catch (error) {
      console.error("스토어 목록 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStoreSelect = async (store: Store) => {
    setLocalFilterData({
      ...localFilterData,
      storeId: store.id,
      storeName: store.name,
    });
    setShowStoreDropdown(false);

    // 스토어 선택 시 날짜 목록 로드
    await loadAvailableDates(store.id);
  };

  const loadAvailableDates = async (storeId: number) => {
    try {
      const slots = await getStoreTimeSlots(storeId);

      // 날짜 추출 및 정렬
      const dates = [
        ...new Set(
          slots.map((slot: TimeSlot) => {
            const date = new Date(slot.startTime);
            return formatDateWithDay(date);
          })
        ),
      ].sort();

      setAvailableDates(dates);

      // 가장 이른 날짜 ~ 가장 마지막 날짜 라벨 계산
      if (slots.length > 0) {
        const sorted = [...slots].sort(
          (a: TimeSlot, b: TimeSlot) =>
            new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
        const first = new Date(sorted[0].startTime);
        const last = new Date(sorted[sorted.length - 1].startTime);
        const label = `${dateFormatter(first, "YYYY. MM. DD")} ~ ${dateFormatter(
          last,
          "YYYY. MM. DD"
        )}`;
        setStoreDateRangeLabel(label);
      } else {
        setStoreDateRangeLabel("");
      }
    } catch (error) {
      console.error("날짜 목록 로드 실패:", error);
    }
  };

  // 날짜 선택
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };

  const handleApply = () => {
    onApplyFilter({
      ...localFilterData,
      date: selectedDate,
    });
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[80vh]">
        <DrawerHeader className="px-5">
          <DrawerTitle className="text-left text-xl font-medium">
            필터 설정하기
          </DrawerTitle>
        </DrawerHeader>

        <div className="mt-6 px-5 pb-6">
          {/* Store Selection */}
          <div className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
              <div className="font-medium">주점 선택</div>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowStoreDropdown(!showStoreDropdown)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-3 text-left"
              >
                <div>
                  <div className="text-sm">{localFilterData.storeName}</div>
                  <div className="text-primary-normal text-xs">
                    {localFilterData.storeId
                      ? storeDateRangeLabel || "날짜 정보를 불러오는 중..."
                      : "스토어를 선택해주세요"}
                  </div>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>

              {showStoreDropdown && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
                  {loading ? (
                    <div className="p-3 text-center text-sm text-gray-500">
                      스토어 목록을 불러오는 중...
                    </div>
                  ) : stores.length === 0 ? (
                    <div className="p-3 text-center text-sm text-gray-500">
                      관리할 수 있는 스토어가 없습니다.
                    </div>
                  ) : (
                    stores.map(store => (
                      <button
                        key={store.id}
                        onClick={() => handleStoreSelect(store)}
                        className={`w-full p-3 text-left text-sm ${
                          localFilterData.storeId === store.id && "bg-red-50"
                        }`}
                      >
                        <div>{store.name}</div>
                        <div className="text-primary-normal text-xs">
                          {storeIdToRange[store.id] ||
                            "날짜 정보를 불러오는 중..."}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
              <div className="font-medium">날짜</div>
            </div>
            {availableDates.length === 0 ? (
              <div className="rounded-lg border border-gray-200 p-3 text-center text-sm text-gray-500">
                스토어를 먼저 선택해주세요
              </div>
            ) : (
              <div className="space-y-2">
                {availableDates.map(date => (
                  <button
                    key={date}
                    onClick={() => handleDateSelect(date)}
                    className={cn(
                      "w-full rounded-lg border p-3 text-left transition-colors",
                      selectedDate === date
                        ? "border-primary-normal bg-red-50"
                        : "border-color-neutral-95"
                    )}
                  >
                    <span
                      className={cn(
                        "text-sm",
                        selectedDate === date
                          ? "text-primary-normal"
                          : "text-color-neutral-30"
                      )}
                    >
                      {date}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <DrawerFooter>
          <button
            onClick={handleApply}
            className="bg-primary-normal w-full rounded-lg py-4 text-lg font-medium text-white"
          >
            필터 설정하기
          </button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
