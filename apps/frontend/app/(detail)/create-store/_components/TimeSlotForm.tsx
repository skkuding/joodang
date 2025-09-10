"use client";

import { FloatingBottomBar } from "@/app/components/FloatingBottomBar";
import { useCreateStoreStore } from "@/app/stores/createStore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Plus, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as v from "valibot";

const timeSlotFormSchema = v.object({
  timeSlots: v.pipe(
    v.array(
      v.object({
        id: v.string(),
        startTime: v.instance(Date, "시작 시간을 입력해주세요"),
        endTime: v.instance(Date, "종료 시간을 입력해주세요"),
      })
    ),
    v.minLength(1, "최소 1개의 시간대를 입력해주세요")
  ),
});

const generateUniqueId = () => `slot_${Date.now()}_${Math.random()}`;

// YYYY-MM-DD 형식으로 날짜 키 생성 (로컬 시간 기준)
const formatDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

type TimeSlotFormData = {
  timeSlots: {
    id: string;
    startTime: Date;
    endTime: Date;
  }[];
};

export default function TimeSlotForm() {
  const { formData, setFormData, nextModal } = useCreateStoreStore(
    state => state
  );

  // 각 요일별로 독립적인 시간대 관리
  const [timeSlots, setTimeSlots] = useState<
    {
      id: string;
      startTime: Date;
      endTime: Date;
    }[]
  >(formData.timeSlots || []);

  // 기존 데이터가 있으면 첫 번째 날짜를 자동 선택
  const getInitialSelectedDate = useCallback(() => {
    if (formData.timeSlots && formData.timeSlots.length > 0) {
      return formatDateKey(formData.timeSlots[0].startTime);
    }
    return "";
  }, [formData.timeSlots]);

  const [selectedDate, setSelectedDate] = useState<string>(
    getInitialSelectedDate()
  );

  // 현재 선택된 날짜의 시간대들
  const currentDateTimeSlots = timeSlots.filter(slot => {
    if (!selectedDate) return false;
    const slotDate = formatDateKey(slot.startTime);
    return slotDate === selectedDate;
  });

  // 기본 시간대 (선택된 날짜가 없을 때 표시)
  const defaultTimeSlots = [
    {
      id: "default_1",
      startTime: new Date(),
      endTime: new Date(),
    },
    {
      id: "default_2",
      startTime: new Date(),
      endTime: new Date(),
    },
    {
      id: "default_3",
      startTime: new Date(),
      endTime: new Date(),
    },
  ];

  const displayTimeSlots = selectedDate
    ? currentDateTimeSlots
    : defaultTimeSlots;

  // 날짜 생성 함수
  const generateDates = () => {
    const dates = [];
    const today = new Date();

    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const dayOfWeek = ["일", "월", "화", "수", "목", "금", "토"][
        date.getDay()
      ];

      dates.push({
        value: `${year}-${month}-${day}`,
        label: `${year}년 ${month}월 ${day}일 (${dayOfWeek})`,
      });
    }

    return dates;
  };

  const availableDates = generateDates();

  const form = useForm<TimeSlotFormData>({
    resolver: valibotResolver(timeSlotFormSchema),
    defaultValues: {
      timeSlots: formData.timeSlots || [],
    },
  });

  const { handleSubmit, setValue, reset, formState } = form;
  const { errors, isValid } = formState;

  // 각 날짜별 입력 방식 상태 관리 - 기존 데이터가 있으면 "manual"로 초기화
  const getInitialDateInputTypes = useCallback(() => {
    const types: Record<string, string> = {};
    if (formData.timeSlots && formData.timeSlots.length > 0) {
      formData.timeSlots.forEach(slot => {
        const dateKey = formatDateKey(slot.startTime);
        types[dateKey] = "manual"; // 기존 데이터가 있으면 "manual"로 설정
      });
    }
    return types;
  }, [formData.timeSlots]);

  const [dateInputTypes, setDateInputTypes] = useState<Record<string, string>>(
    getInitialDateInputTypes()
  );

  // 편집 모드에서 formData 변경 시 동기화
  useEffect(() => {
    setTimeSlots(formData.timeSlots || []);
    reset({ timeSlots: formData.timeSlots || [] });
    setSelectedDate(getInitialSelectedDate());
    setDateInputTypes(getInitialDateInputTypes());
  }, [formData, reset, getInitialSelectedDate, getInitialDateInputTypes]);

  // 자동 입력 모달 상태
  const [isAutoModalOpen, setIsAutoModalOpen] = useState(false);
  const [autoStartTime, setAutoStartTime] = useState("09:00");
  const [autoInterval, setAutoInterval] = useState("60"); // 분 단위

  const onSubmit = (data: TimeSlotFormData) => {
    setFormData({ ...formData, ...data });
    nextModal();
  };

  const handleDateSelect = (dateValue: string) => {
    if (selectedDate === dateValue) {
      // 같은 날짜를 다시 클릭하면 선택 해제
      setSelectedDate("");
    } else {
      // 새로운 날짜 선택
      setSelectedDate(dateValue);

      // 해당 날짜의 입력 방식이 없으면 기본값 "none" 설정
      if (!dateInputTypes[dateValue]) {
        setDateInputTypes(prev => ({
          ...prev,
          [dateValue]: "none",
        }));
      }
    }
  };

  const handleTimeInputTypeChange = (value: string) => {
    if (!selectedDate) return;

    if (value === "auto") {
      // 자동 입력 선택 시 모달 열기
      setIsAutoModalOpen(true);
      return;
    }

    // 해당 날짜의 입력 방식 업데이트
    setDateInputTypes(prev => ({
      ...prev,
      [selectedDate]: value,
    }));

    // 기존 해당 날짜의 시간대 제거
    const filteredSlots = timeSlots.filter(slot => {
      const slotDate = formatDateKey(slot.startTime);
      return slotDate !== selectedDate;
    });

    if (value === "manual") {
      // 직접 입력 선택 시 기본 시간대 생성
      const selectedDateObj = new Date(selectedDate);
      const manualTimeSlots = defaultTimeSlots.map(() => ({
        id: generateUniqueId(),
        startTime: new Date(selectedDateObj),
        endTime: new Date(selectedDateObj),
      }));
      setTimeSlots([...filteredSlots, ...manualTimeSlots]);
      setValue("timeSlots", [...filteredSlots, ...manualTimeSlots], {
        shouldValidate: true,
      });
    } else {
      // 운영 안 함 선택 시 시간대 제거
      setTimeSlots(filteredSlots);
      setValue("timeSlots", filteredSlots, { shouldValidate: true });
    }
  };

  const handleAutoGenerate = () => {
    if (!selectedDate) return;

    // 해당 날짜의 입력 방식을 manual로 변경 (직접 입력한 것처럼 취급)
    setDateInputTypes(prev => ({
      ...prev,
      [selectedDate]: "manual",
    }));

    // 기존 해당 날짜의 시간대 제거
    const filteredSlots = timeSlots.filter(slot => {
      const slotDate = formatDateKey(slot.startTime);
      return slotDate !== selectedDate;
    });

    // 자동 생성된 시간대들
    const autoTimeSlots = [];
    const [startHour, startMinute] = autoStartTime.split(":").map(Number);
    const intervalMinutes = parseInt(autoInterval);
    const selectedDateObj = new Date(selectedDate);

    for (let i = 0; i < 12; i++) {
      const startMinutes = startHour * 60 + startMinute + i * intervalMinutes;
      const endMinutes = startMinutes + intervalMinutes;

      // 시작 시간이 24시간(1440분)을 초과하면 중단
      if (startMinutes >= 1440) {
        break;
      }

      const startTimeHour = Math.floor(startMinutes / 60);
      const startTimeMinute = startMinutes % 60;
      const endTimeHour = Math.floor(endMinutes / 60);
      const endTimeMinute = endMinutes % 60;

      // Date 객체 생성
      const startDateTime = new Date(selectedDateObj);
      startDateTime.setHours(startTimeHour, startTimeMinute, 0, 0);

      const endDateTime = new Date(selectedDateObj);
      endDateTime.setHours(endTimeHour, endTimeMinute, 0, 0);

      autoTimeSlots.push({
        id: generateUniqueId(),
        startTime: startDateTime,
        endTime: endDateTime,
      });
    }

    setTimeSlots([...filteredSlots, ...autoTimeSlots]);
    setValue("timeSlots", [...filteredSlots, ...autoTimeSlots], {
      shouldValidate: true,
    });
    setIsAutoModalOpen(false);
  };

  const addTimeSlot = () => {
    if (!selectedDate) return;

    const currentDateSlots = timeSlots.filter(slot => {
      const slotDate = formatDateKey(slot.startTime);
      return slotDate === selectedDate;
    });

    if (currentDateSlots.length < 12) {
      const selectedDateObj = new Date(selectedDate);
      const newSlot = {
        id: generateUniqueId(),
        startTime: selectedDateObj,
        endTime: selectedDateObj,
      };
      setTimeSlots([...timeSlots, newSlot]);
      setValue("timeSlots", [...timeSlots, newSlot], { shouldValidate: true });
    }
  };

  const removeTimeSlot = (id: string) => {
    const currentDateSlots = timeSlots.filter(slot => {
      const slotDate = formatDateKey(slot.startTime);
      return slotDate === selectedDate;
    });

    if (currentDateSlots.length > 1) {
      const newSlots = timeSlots.filter(slot => slot.id !== id);
      setTimeSlots(newSlots);
      setValue("timeSlots", newSlots, { shouldValidate: true });
    }
  };

  const updateTimeSlot = (
    id: string,
    field: "startTime" | "endTime",
    value: Date
  ) => {
    if (!selectedDate) return;

    const newSlots = timeSlots.map(slot => {
      if (slot.id === id) {
        return { ...slot, [field]: value };
      }
      return slot;
    });
    setTimeSlots(newSlots);
    setValue("timeSlots", newSlots, { shouldValidate: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-primary-normal mb-[2px] text-xs">2단계</div>
      <div className="mb-10 text-xl font-medium">
        날짜와 시간 정보를 입력해주세요
      </div>
      <div className="mb-13 flex flex-col gap-10">
        {/* 운영 날짜 선택 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
            <label className="font-medium">운영 날짜</label>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {availableDates.slice(0, 6).map(date => {
              const hasTimeSlots = timeSlots.some(slot => {
                const slotDate = formatDateKey(slot.startTime);
                return slotDate === date.value;
              });

              return (
                <button
                  key={date.value}
                  type="button"
                  className={cn(
                    "rounded-md border px-3 py-2 text-sm transition-colors",
                    selectedDate === date.value
                      ? hasTimeSlots
                        ? "border-primary-normal bg-primary-normal text-white"
                        : "border-primary-normal text-primary-normal bg-white"
                      : hasTimeSlots
                        ? "border-primary-normal bg-primary-normal text-white"
                        : "border-color-neutral-95 bg-white text-black"
                  )}
                  onClick={() => handleDateSelect(date.value)}
                >
                  {date.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 운영 시간 */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
            <label className="font-medium">운영 시간</label>
          </div>
          <div className="text-color-neutral-50 text-xs">
            하루 최대 12개까지 등록 가능합니다
          </div>

          {/* 입력 방식 선택 */}
          <RadioGroup
            value={
              selectedDate ? dateInputTypes[selectedDate] || "none" : "none"
            }
            onValueChange={handleTimeInputTypeChange}
            className="bg-color-neutral-99 flex gap-4 rounded-md px-4 py-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="none" />
              <Label
                htmlFor="none"
                className={cn(
                  "text-sm transition-colors",
                  dateInputTypes[selectedDate] === "none"
                    ? "text-primary-normal"
                    : "text-color-neutral-70"
                )}
              >
                운영 안 함
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manual" id="manual" />
              <Label
                htmlFor="manual"
                className={cn(
                  "text-sm transition-colors",
                  dateInputTypes[selectedDate] === "manual"
                    ? "text-primary-normal"
                    : "text-color-neutral-70"
                )}
              >
                직접 입력
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="auto" id="auto" />
              <Label
                htmlFor="auto"
                className={cn(
                  "text-sm transition-colors",
                  dateInputTypes[selectedDate] === "auto"
                    ? "text-primary-normal"
                    : "text-color-neutral-70"
                )}
              >
                자동 입력
              </Label>
            </div>
          </RadioGroup>

          {/* 자동 입력 모달 */}
          <Dialog open={isAutoModalOpen} onOpenChange={setIsAutoModalOpen}>
            <DialogContent
              className="sm:max-w-md"
              onOpenAutoFocus={e => e.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle className="mb-2 text-left">
                  자동 시간대 생성
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-5">
                <div>
                  <Label
                    htmlFor="startTime"
                    className="flex items-center gap-2 text-base font-medium"
                  >
                    <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
                    시작 시간
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={autoStartTime}
                    onChange={e => setAutoStartTime(e.target.value)}
                    className="mt-2 h-[52px] p-4 text-sm"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="interval"
                    className="flex items-center gap-2 text-base font-medium"
                  >
                    <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
                    간격
                  </Label>
                  <Select value={autoInterval} onValueChange={setAutoInterval}>
                    <SelectTrigger className="mt-1 h-[52px] p-4 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem
                        value="60"
                        className="focus:bg-primary-normal/10 px-4 py-[14px] text-sm"
                      >
                        1시간 단위
                      </SelectItem>
                      <SelectItem
                        value="90"
                        className="focus:bg-primary-normal/10 px-4 py-[14px] text-sm"
                      >
                        1시간 30분 단위
                      </SelectItem>
                      <SelectItem
                        value="120"
                        className="focus:bg-primary-normal/10 px-4 py-[14px] text-sm"
                      >
                        2시간 단위
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button
                    onClick={handleAutoGenerate}
                    className="bg-primary-normal"
                  >
                    확인
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* 시간대 입력 */}
          {selectedDate && dateInputTypes[selectedDate] !== "none" && (
            <div className="space-y-3">
              {displayTimeSlots.map((slot, index) => {
                // Date 객체를 HH:MM 형태로 변환하는 함수 (표기용)
                const formatTimeForDisplay = (dateTime: Date) => {
                  const hours = dateTime.getHours();
                  const minutes = dateTime.getMinutes();
                  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
                };

                // 시간 문자열을 Date 객체로 변환하는 함수 (저장용)
                const formatTimeForSave = (
                  displayTime: string,
                  originalDateTime: Date,
                  isEndTime: boolean = false
                ) => {
                  const [displayHour, minute] = displayTime
                    .split(":")
                    .map(Number);
                  const originalHour = originalDateTime.getHours();

                  // 마지막 타임의 끝나는 시간만 24시간을 초과할 수 있음
                  const isLastTimeSlot = index === displayTimeSlots.length - 1;

                  if (originalHour >= 24) {
                    // 원래 시간이 24시간을 넘어갔다면 24시간을 더해서 저장
                    const newDateTime = new Date(originalDateTime);
                    newDateTime.setHours(displayHour + 24, minute, 0, 0);
                    return newDateTime;
                  } else if (isEndTime && isLastTimeSlot) {
                    // 마지막 타임의 끝나는 시간이고, 시작 시간이 오후(12시 이후)인 경우
                    const startHour = slot.startTime.getHours();
                    if (startHour >= 12 && displayHour < startHour) {
                      // 끝나는 시간이 시작 시간보다 이르면 다음날로 계산
                      const newDateTime = new Date(originalDateTime);
                      newDateTime.setHours(displayHour + 24, minute, 0, 0);
                      return newDateTime;
                    }
                  } else if (isEndTime && !isLastTimeSlot) {
                    // 마지막 타임이 아닌 경우: 끝나는 시간이 시작 시간보다 이르면 안됨
                    const startHour = slot.startTime.getHours();
                    const startMinute = slot.startTime.getMinutes();
                    const startTotalMinutes = startHour * 60 + startMinute;
                    const endTotalMinutes = displayHour * 60 + minute;

                    if (endTotalMinutes <= startTotalMinutes) {
                      // 끝나는 시간이 시작 시간보다 이르거나 같으면 시작 시간 + 1시간으로 설정
                      const newEndTotalMinutes = startTotalMinutes + 60;
                      const newEndHour = Math.floor(newEndTotalMinutes / 60);
                      const newEndMinute = newEndTotalMinutes % 60;
                      const newDateTime = new Date(originalDateTime);
                      newDateTime.setHours(newEndHour, newEndMinute, 0, 0);
                      return newDateTime;
                    }
                  }

                  // 기본적으로 시간만 업데이트
                  const newDateTime = new Date(originalDateTime);
                  newDateTime.setHours(displayHour, minute, 0, 0);
                  return newDateTime;
                };

                return (
                  <div key={slot.id} className="flex items-center gap-2">
                    <span className="text-color-neutral-50 min-w-[40px] text-sm font-medium">
                      타임 {index + 1}
                    </span>
                    <Input
                      type="time"
                      value={formatTimeForDisplay(slot.startTime)}
                      onChange={e => {
                        const newDateTime = formatTimeForSave(
                          e.target.value,
                          slot.startTime,
                          false
                        );
                        updateTimeSlot(slot.id, "startTime", newDateTime);
                      }}
                      className="h-[50px]"
                    />
                    <span className="text-color-neutral-60">~</span>
                    <Input
                      type="time"
                      value={formatTimeForDisplay(slot.endTime)}
                      onChange={e => {
                        const newDateTime = formatTimeForSave(
                          e.target.value,
                          slot.endTime,
                          true
                        );
                        updateTimeSlot(slot.id, "endTime", newDateTime);
                      }}
                      className="h-[50px]"
                    />
                    {displayTimeSlots.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTimeSlot(slot.id)}
                        className="text-color-neutral-60 hover:text-red-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                );
              })}

              {selectedDate && (
                <button
                  type="button"
                  onClick={addTimeSlot}
                  className={cn(
                    "flex h-10 w-full items-center justify-center rounded-md text-sm",
                    displayTimeSlots.length >= 12
                      ? "bg-color-neutral-95 text-color-neutral-70"
                      : "border-primary-normal text-primary-normal border"
                  )}
                  disabled={displayTimeSlots.length >= 12}
                >
                  <Plus className="h-4 w-4" />
                  추가하기
                </button>
              )}
            </div>
          )}
          {errors.timeSlots && (
            <p className="mt-1 text-xs text-red-500">
              {errors.timeSlots.message}
            </p>
          )}
        </div>
      </div>
      <FloatingBottomBar>
        <Button type="submit" disabled={!isValid}>
          다음
        </Button>
      </FloatingBottomBar>
    </form>
  );
}
