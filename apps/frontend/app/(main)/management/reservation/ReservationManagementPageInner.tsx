"use client";

import { useState, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

export default function ReservationManagementPageInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialTabParam = searchParams.get("tab");
  const initialTab =
    initialTabParam === "confirmed" || initialTabParam === "waiting"
      ? (initialTabParam as "confirmed" | "waiting")
      : "all";
  const [activeTab, setActiveTab] = useState<"all" | "confirmed" | "waiting">(
    initialTab
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
  const isFetchingRef = useRef(false);
  const isInitialLoadRef = useRef(true);
  const skipNextSoundRef = useRef(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioPrimedRef = useRef(false);

  const playBeep = async () => {
    if (typeof window === "undefined") return;
    const windowWithAudio = window as typeof window & {
      webkitAudioContext?: typeof AudioContext;
    };
    const AC = windowWithAudio.AudioContext || windowWithAudio.webkitAudioContext;
    if (!AC) return;
    if (!audioCtxRef.current) audioCtxRef.current = new AC();
    const ctx = audioCtxRef.current;
    try {
      if (ctx.state === "suspended") await ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 880; // A5 beep
      // Quick attack then short decay to avoid click noises
      const now = ctx.currentTime;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(now + 0.26);
    } catch {
      // ignore playback errors
    }
  };

  // dingdong.mp3 플레이어 초기화
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!audioRef.current) {
      const a = new Audio("/dingdong.mp3");
      a.preload = "auto";
      // iOS에서 인라인 재생 허용
      (a as HTMLAudioElement & { playsInline?: boolean }).playsInline = true;
      a.crossOrigin = "anonymous";
      audioRef.current = a;
    }
  }, []);

  // 사용자 제스처에서 한번 미리 재생하여 오디오 정책 해제
  const primeDingdong = async () => {
    if (audioPrimedRef.current) return;
    const a = audioRef.current;
    if (!a) return;
    try {
      a.muted = true;
      await a.play();
      a.pause();
      a.currentTime = 0;
      a.muted = false;
      audioPrimedRef.current = true;
    } catch {
      // 사용자가 아직 상호작용하지 않았거나 정책으로 차단됨
    }
  };

  const playDingdong = async () => {
    const a = audioRef.current;
    if (!a) {
      // 안전상 비프음으로 폴백
      return playBeep();
    }
    try {
      a.currentTime = 0;
      await a.play();
    } catch {
      // 정책/오류 시 비프음으로 폴백
      await playBeep();
    }
  };

  // 기존 아이템은 참조를 재사용해 변경 없는 항목의 리렌더를 피한다
  const shallowEqualReservation = (
    a: ReservationResponse,
    b: ReservationResponse
  ) => {
    return (
      a.id === b.id &&
      a.reservationNum === b.reservationNum &&
      a.isConfirmed === b.isConfirmed &&
      a.headcount === b.headcount &&
      a.phone === b.phone &&
      a.timeSlot.startTime === b.timeSlot.startTime &&
      a.timeSlot.endTime === b.timeSlot.endTime
    );
  };

  const reconcileReservations = (
    prev: ReservationResponse[],
    next: ReservationResponse[]
  ): ReservationResponse[] => {
    if (prev.length === 0) return next;
    const map = new Map(prev.map(r => [r.id, r] as const));
    let allSame = prev.length === next.length;
    const merged = next.map((n, idx) => {
      const p = map.get(n.id);
      if (p && shallowEqualReservation(p, n)) {
        if (allSame && prev[idx]?.id !== n.id) allSame = false; // 순서 변경 감지
        return p; // 변경 없음 → 기존 객체 재사용
      }
      allSame = false;
      return n;
    });
    return allSame ? prev : merged;
  };

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

  // 페이지에 복귀(포커스/가시성/페이지쇼) 시 첫 fetch 알림 억제
  useEffect(() => {
    const muteOnce = () => {
      skipNextSoundRef.current = true;
    };
    const onVisibility = () => {
      if (document.visibilityState === "visible") muteOnce();
    };
    window.addEventListener("focus", muteOnce);
    window.addEventListener("pageshow", muteOnce);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("focus", muteOnce);
      window.removeEventListener("pageshow", muteOnce);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // 히스토리 뒤로가기(popstate) 시 다음 알림 억제
  useEffect(() => {
    const onPop = () => {
      skipNextSoundRef.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // 경로 변경될 때 다음 알림 억제 (상세 → 목록 복귀 포함)
  useEffect(() => {
    skipNextSoundRef.current = true;
  }, [pathname]);

  // 예약 목록 로드
  const loadReservations = async () => {
    if (!filterData.storeId) return;
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    if (isInitialLoadRef.current) setLoading(true);
    setError(null);

    try {
      const filters = {
        isConfirmed: activeTab === "confirmed" ? true : undefined,
        isWalkIn: activeTab === "waiting" ? true : undefined,
      };

      const data = await getStoreReservations(filterData.storeId, filters);
      setReservations(prev => {
        const prevIds = new Set(prev.map(p => p.id));
        // 선택된 날짜/탭에 부합하는 신규 항목만 카운트
        const sd = parseSelectedDate(filterData.date);
        const matchesView = (r: ReservationResponse) => {
          const slotDate = new Date(r.timeSlot.startTime);
          const matchesSelectedDate = sd
            ? slotDate.getFullYear() === sd.getFullYear() &&
              slotDate.getMonth() === sd.getMonth() &&
              slotDate.getDate() === sd.getDate()
            : true;
          if (activeTab === "all") {
            return r.timeSlot.totalCapacity !== -1 && matchesSelectedDate;
          }
          if (activeTab === "confirmed") {
            return (
              r.timeSlot.totalCapacity !== -1 &&
              r.isConfirmed === true &&
              matchesSelectedDate
            );
          }
          return r.timeSlot.totalCapacity === -1; // waiting
        };
        const newCount = data.reduce(
          (acc, d) => (!prevIds.has(d.id) && matchesView(d) ? acc + 1 : acc),
          0
        );
        const merged = reconcileReservations(prev, data);
        if (
          !isInitialLoadRef.current &&
          !skipNextSoundRef.current &&
          newCount > 0
        ) {
          void playDingdong();
        }
        if (skipNextSoundRef.current) skipNextSoundRef.current = false;
        return merged;
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "예약 목록을 불러오는데 실패했습니다."
      );
    } finally {
      if (isInitialLoadRef.current) {
        setLoading(false);
        isInitialLoadRef.current = false;
      }
      isFetchingRef.current = false;
    }
  };

  // 브라우저 내비게이션으로 쿼리가 바뀌면 탭 동기화
  useEffect(() => {
    const t = searchParams.get("tab");
    const nextTab =
      t === "confirmed" || t === "waiting" ? t : t === "all" ? "all" : "all";
    if (nextTab !== activeTab) setActiveTab(nextTab as typeof activeTab);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // 탭 변경 시 예약 목록 다시 로드
  useEffect(() => {
    loadReservations();
  }, [activeTab, filterData.storeId]);

  // 3초 폴링 (탭/스토어 변경 시 재시작)
  useEffect(() => {
    if (!filterData.storeId) return;
    const id = setInterval(() => {
      loadReservations();
    }, 3000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            onClick={() => {
              void primeDingdong();
              setIsFilterModalOpen(true);
            }}
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
              onClick={() => {
                // 오디오 사용 가능하도록 프라임 시도 (사용자 제스처 내)
                void primeDingdong();
                const next = tab.key as "all" | "confirmed" | "waiting";
                // 탭 변경 직후 첫 fetch는 소리 생략
                skipNextSoundRef.current = true;
                setActiveTab(next);
                const params = new URLSearchParams(searchParams.toString());
                if (next === "all") params.delete("tab");
                else params.set("tab", next);
                const qs = params.toString();
                router.replace(qs ? `${pathname}?${qs}` : pathname, {
                  scroll: false,
                });
              }}
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
        onApplyFilter={data => {
          // 필터/스토어 변경 직후 첫 fetch는 소리 생략
          skipNextSoundRef.current = true;
          void primeDingdong();
          setFilterData(data);
        }}
      />
    </div>
  );
}
