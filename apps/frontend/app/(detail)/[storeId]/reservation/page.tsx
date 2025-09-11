"use client";
import { Separator } from "@/app/(main)/components/Separator";
import { AuthSheet } from "@/app/components/AuthSheet";
import { FloatingBottomBar } from "@/app/components/FloatingBottomBar";
import { FormSection } from "@/app/components/FormSection";
import { StoreDetail, TimeSlot } from "@/app/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDateWithDay, formatTimeToKST, safeFetcher } from "@/lib/utils";
import minusIcon from "@/public/icons/icon_minus.svg";
import plusIcon from "@/public/icons/icon_plus.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import Image from "next/image";
import { useParams } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { IoIosArrowDown } from "react-icons/io";
import { StoreInfo } from "../../components/StoreInfo";
import { CreateReservationForm } from "./components/CreateReservationForm";

const ReservationForm = memo(
  ({
    store,
    availableDates,
    timeSlotsMap,
    selectedDate,
    setSelectedDate,
    setSelectedTimeSlotId,
    selectedTimeSlot,
    selectedTimeSlotIndex,
    selectedDateSlots,
  }: {
    store: StoreDetail;
    availableDates: string[];
    timeSlotsMap: Map<string, TimeSlot[]>;
    selectedDate: string | null;
    setSelectedDate: (date: string | null) => void;
    setSelectedTimeSlotId: (id: number | null) => void;
    selectedTimeSlot: TimeSlot | null;
    selectedTimeSlotIndex: number;
    selectedDateSlots: TimeSlot[];
  }) => {
    const { register, setValue } = useFormContext();
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
      setValue("storeId", store.id);
    }, [store.id, setValue]);

    return (
      <div className="flex flex-col gap-10 p-5">
        <FormSection title="날짜">
          <div className="grid grid-cols-2 gap-2">
            {availableDates.map(dateKey => {
              const firstSlot = timeSlotsMap.get(dateKey)?.[0];
              if (!firstSlot) return null;

              return (
                <Button
                  type="button"
                  key={dateKey}
                  variant={selectedDate === dateKey ? "selected" : "outline"}
                  className="h-[37px] rounded"
                  disabled={timeSlotsMap
                    .get(dateKey)
                    ?.every(slot => slot.availableSeats === 0)}
                  onClick={() => {
                    setSelectedDate(dateKey);
                    setSelectedTimeSlotId(null);
                  }}
                >
                  <span className="text-sm font-normal">
                    {formatDateWithDay(firstSlot.startTime)}
                  </span>
                </Button>
              );
            })}
          </div>
        </FormSection>

        <FormSection title="시간대">
          <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                onPointerDown={e => e.preventDefault()}
                onClick={() => setDropdownOpen(true)}
                aria-placeholder="시간대를 선택해주세요"
                className="flex h-[52px] w-full items-center justify-between rounded-md border pl-5 pr-[14px] text-sm font-normal"
              >
                {selectedTimeSlot ? (
                  <div className="flex gap-2">
                    <span>타임 {selectedTimeSlotIndex}</span>
                    <span className="text-primary-normal">
                      {formatTimeToKST(selectedTimeSlot.startTime)} ~{" "}
                      {formatTimeToKST(selectedTimeSlot.endTime)}
                    </span>
                  </div>
                ) : (
                  <span className="text-color-neutral-90">
                    시간대를 선택해주세요
                  </span>
                )}

                <IoIosArrowDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
              {selectedDate ? (
                selectedDateSlots.map((slot, index) => (
                  <DropdownMenuItem
                    key={slot.id}
                    className="flex cursor-pointer items-start justify-between py-3 hover:bg-gray-100"
                    onSelect={() => {
                      setSelectedTimeSlotId(slot.id);
                      setValue("timeSlotId", slot.id, {
                        shouldValidate: true,
                      });
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        타임 {index + 1}
                      </span>
                      <span className="text-color-neutral-60 text-xs font-normal">
                        {slot.availableSeats}석 남음
                      </span>
                    </div>
                    <span className="text-primary-normal text-sm font-normal">
                      {formatTimeToKST(slot.startTime)} ~{" "}
                      {formatTimeToKST(slot.endTime)}
                    </span>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-sm">먼저 날짜를 선택해주세요</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </FormSection>
      </div>
    );
  }
);
ReservationForm.displayName = "ReservationForm";

const Counter = memo(
  ({
    count,
    setCount,
  }: {
    count: number;
    setCount: (fn: (prev: number) => number) => void;
  }) => {
    const { setValue } = useFormContext();

    const handleCountChange = useCallback(
      (newCount: number) => {
        setCount(() => newCount);
        setValue("headcount", newCount, { shouldValidate: true });
      },
      [setCount, setValue]
    );

    return (
      <FormSection title="총 인원" isRow>
        <div className="flex items-center gap-5">
          <Button
            variant="counter"
            type="button"
            className="h-[38px] w-[38px] p-[7px]"
            onClick={() => handleCountChange(Math.max(count - 1, 0))}
          >
            <Image src={minusIcon} alt="Remove" />
          </Button>
          <span className="text-base font-medium">{count}</span>
          <Button
            variant="counter"
            type="button"
            className="h-[38px] w-[38px] p-[7px]"
            onClick={() => handleCountChange(count + 1)}
          >
            <Image src={plusIcon} alt="Add" />
          </Button>
        </div>
      </FormSection>
    );
  }
);
Counter.displayName = "Counter";

const PhoneInput = memo(() => {
  const { register } = useFormContext();
  return (
    <FormSection
      title="본인 전화번호"
      description="주점에서 연락이 갈 수 있어요! 연락 가능한 번호를 작성해주세요"
    >
      <div className="flex gap-1">
        <Input type="number" placeholder="010" disabled />
        <Input type="tel" maxLength={4} {...register("phoneMiddle")} />
        <Input type="tel" maxLength={4} {...register("phoneLast")} />
      </div>
    </FormSection>
  );
});
PhoneInput.displayName = "PhoneInput";

const SubmitButton = memo(() => {
  const {
    formState: { isValid },
  } = useFormContext();
  return (
    <FloatingBottomBar>
      {/* <Button className="w-full" type="submit" disabled={!isValid}> */}
      <Button className="w-full" type="submit" disabled>
        예약하기
      </Button>
    </FloatingBottomBar>
  );
});
SubmitButton.displayName = "SubmitButton";

export default function Page() {
  const { storeId } = useParams();

  const [count, setCount] = useState(0);
  const [store, setStore] = useState<StoreDetail | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<number | null>(
    null
  );

  const timeSlotsMap = useMemo(() => {
    if (!store?.timeSlots) return new Map<string, TimeSlot[]>();

    const slotsMap = new Map<string, TimeSlot[]>();
    store.timeSlots.forEach(slot => {
      // UTC 시간을 한국 시간으로 변환하여 날짜 키 생성
      const utcDate = new Date(slot.startTime);
      const dateKey = utcDate.toLocaleDateString("ko-KR", {
        timeZone: "Asia/Seoul",
        weekday: "short",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (!slotsMap.has(dateKey)) {
        slotsMap.set(dateKey, []);
      }
      slotsMap.get(dateKey)!.push(slot);
    });

    // 각 날짜별로 시간순 정렬
    slotsMap.forEach(slots => {
      slots.sort(
        (a, b) =>
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
      );
    });

    return slotsMap;
  }, [store?.timeSlots]);

  const availableDates = useMemo(
    () =>
      Array.from(timeSlotsMap.keys()).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      ),
    [timeSlotsMap]
  );

  const selectedDateSlots = useMemo(
    () => (selectedDate ? timeSlotsMap.get(selectedDate) || [] : []),
    [selectedDate, timeSlotsMap]
  );

  // 선택된 TimeSlot 정보를 memoization으로 최적화
  const selectedTimeSlot = useMemo(() => {
    if (!selectedTimeSlotId) return null;
    return selectedDateSlots.find(slot => slot.id === selectedTimeSlotId);
  }, [selectedTimeSlotId, selectedDateSlots]);

  // 선택된 TimeSlot의 인덱스
  const selectedTimeSlotIndex = useMemo(() => {
    if (!selectedTimeSlot) return 0;
    return selectedDateSlots.indexOf(selectedTimeSlot) + 1;
  }, [selectedTimeSlot, selectedDateSlots]);

  useEffect(() => {
    const fetchStore = async () => {
      const store: StoreDetail = await safeFetcher
        .get(`store/${storeId}`)
        .json();
      setStore(store);
    };

    fetchStore();
  }, [storeId]);

  if (!store) {
    return null;
  }
  return (
    <div>
      <AuthSheet />
      <CreateReservationForm store={store}>
        <StoreInfo store={store} />
        <Separator />
        <ReservationForm
          store={store}
          availableDates={availableDates}
          timeSlotsMap={timeSlotsMap}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setSelectedTimeSlotId={setSelectedTimeSlotId}
          selectedTimeSlot={selectedTimeSlot ?? null}
          selectedTimeSlotIndex={selectedTimeSlotIndex}
          selectedDateSlots={selectedDateSlots}
        />
        <div className="flex flex-col gap-10 p-5 pt-0">
          <Counter count={count} setCount={setCount} />
          <PhoneInput />
        </div>
        <SubmitButton />
      </CreateReservationForm>
      <div className="h-15" />
    </div>
  );
}
