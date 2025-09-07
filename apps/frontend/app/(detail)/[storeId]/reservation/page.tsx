"use client";
import { Separator } from "@/app/(main)/components/Separator";
import { AuthSheet } from "@/app/components/AuthSheet";
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
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { IoIosArrowDown } from "react-icons/io";
import { StoreInfo } from "../../components/StoreInfo";
import { CreateReservationForm } from "./components/CreateReservationForm";

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
      const kstDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);
      const dateKey = kstDate.toDateString();

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

  function ReservationForm() {
    const { register, setValue } = useFormContext();
    if (!store) {
      return;
    }

    return (
      setValue("storeId", store.id),
      (
        <div className="flex flex-col gap-10 p-5">
          <FormSection title="날짜">
            <div className="grid grid-cols-2 gap-2">
              {availableDates.map(dateKey => {
                const firstSlot = timeSlotsMap.get(dateKey)?.[0];
                if (!firstSlot) return null;

                return (
                  <Button
                    key={dateKey}
                    variant={selectedDate === dateKey ? "selected" : "outline"}
                    className="h-[37px]"
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
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-placeholder="시간대를 선택해주세요"
                className="flex h-[52px] items-center justify-between rounded-md border pl-5 pr-[14px] text-sm font-normal"
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
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
                {selectedDate ? (
                  selectedDateSlots.map((slot, index) => (
                    <DropdownMenuLabel
                      key={slot.id}
                      className="flex cursor-pointer flex-col py-3 hover:bg-gray-100"
                      onClick={() => {
                        setSelectedTimeSlotId(slot.id);
                        setValue("timeSlotId", slot.id, {
                          shouldValidate: true,
                        });
                      }}
                    >
                      <span className="text-xs text-gray-500">
                        타임 {index + 1}
                      </span>
                      <span className="text-sm">
                        {formatTimeToKST(slot.startTime)} ~{" "}
                        {formatTimeToKST(slot.endTime)}
                      </span>
                      <span className="text-xs text-blue-600">
                        {slot.availableSeats}석 남음
                      </span>
                    </DropdownMenuLabel>
                  ))
                ) : (
                  <DropdownMenuLabel>
                    먼저 날짜를 선택해주세요
                  </DropdownMenuLabel>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </FormSection>

          <FormSection title="총 인원" isRow>
            <div className="flex items-center gap-5">
              <Button variant="outline" className="h-[38px] w-[38px] p-[7px]">
                <Image
                  src={plusIcon}
                  alt="Add"
                  onClick={() => {
                    setCount(prev => prev + 1);
                    setValue("headcount", count + 1, { shouldValidate: true });
                  }}
                />
              </Button>
              <span className="text-base font-medium">{count}</span>
              <Button variant="outline" className="h-[38px] w-[38px] p-[7px]">
                <Image
                  src={minusIcon}
                  alt="Remove"
                  onClick={() => {
                    setCount(prev => Math.max(prev - 1, 0));
                    setValue("headcount", count - 1, { shouldValidate: true });
                  }}
                />
              </Button>
            </div>
          </FormSection>

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
        </div>
      )
    );
  }

  function SubmitButton() {
    const {
      formState: { isValid },
    } = useFormContext();
    return (
      <div className="pb-15 fixed bottom-0 left-0 right-0 p-5">
        <Button className="w-full" type="submit" disabled={!isValid}>
          예약하기
        </Button>
      </div>
    );
  }

  if (!store) {
    return;
  }

  return (
    <div>
      <AuthSheet />
      <div className="h-4" />
      <CreateReservationForm>
        <StoreInfo store={store} />
        <Separator />
        <ReservationForm />
        <SubmitButton />
      </CreateReservationForm>
      <div className="h-15" />
    </div>
  );
}
