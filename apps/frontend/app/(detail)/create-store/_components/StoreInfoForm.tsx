"use client";

import { FloatingBottomBar } from "@/app/components/FloatingBottomBar";
import { useCreateStoreStore } from "@/app/stores/createStore";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { BankCodes } from "@/constant";
import { cn } from "@/lib/utils";
import Arrow from "@/public/icons/icon_arrow.svg";
import MinusIcon from "@/public/icons/icon_minus.svg";
import PlusIcon from "@/public/icons/icon_plus.svg";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { Check } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as v from "valibot";
import ImageUploadForm from "./ImageUploadForm";
import {
  BagIcon,
  DumbbellIcon,
  HeartIcon,
  HospitalIcon,
  HouseIcon,
  KeyIcon,
  LeafIcon,
  MonitorIcon,
  NoodleIcon,
  PawIcon,
} from "./StoreIcons";

const Icons = [
  PawIcon,
  HeartIcon,
  NoodleIcon,
  LeafIcon,
  DumbbellIcon,
  BagIcon,
  MonitorIcon,
  HospitalIcon,
  HouseIcon,
  KeyIcon,
];

const storeFormSchema = v.object({
  name: v.pipe(v.string(), v.minLength(1, "주점명을 입력해주세요")),
  organizer: v.pipe(v.string(), v.minLength(1, "단체명을 입력해주세요")),
  description: v.pipe(v.string(), v.minLength(1, "상세 설명을 입력해주세요")),
  icon: v.pipe(v.number(), v.minValue(1, "아이콘을 선택해주세요")),
  totalCapacity: v.pipe(
    v.number(),
    v.minValue(1, "총 좌석은 1개 이상이어야 합니다")
  ),
  bankCode: v.pipe(v.string(), v.minLength(1, "은행을 선택해주세요")),
  accountNumber: v.pipe(
    v.string(),
    v.minLength(1, "계좌번호를 입력해주세요"),
    v.regex(/^\d+$/, "숫자만 입력 가능합니다")
  ),
  accountHolder: v.pipe(v.string(), v.minLength(1, "예금주명을 입력해주세요")),
  contactInfo: v.pipe(v.string(), v.minLength(1, "연락 수단을 입력해주세요")),
  reservationFee: v.pipe(
    v.number(),
    v.minValue(0, "예약비는 0원 이상이어야 합니다")
  ),
  startTime: v.pipe(v.string(), v.minLength(1, "시작 시간을 입력해주세요")),
  endTime: v.pipe(v.string(), v.minLength(1, "종료 시간을 입력해주세요")),
});

type StoreFormData = {
  name: string;
  organizer: string;
  description: string;
  icon: number;
  totalCapacity: number;
  bankCode: string;
  accountNumber: string;
  accountHolder: string;
  contactInfo: string;
  reservationFee: number;
  startTime: string;
  endTime: string;
};

export default function StoreInfoForm() {
  const { formData, setFormData, nextModal, isEditMode } = useCreateStoreStore(
    state => state
  );
  const [open, setOpen] = useState(false);

  const form = useForm<StoreFormData>({
    resolver: valibotResolver(storeFormSchema),
    defaultValues: {
      name: formData.name,
      organizer: formData.organizer,
      description: formData.description,
      icon: formData.icon,
      totalCapacity: formData.totalCapacity,
      bankCode: formData.bankCode,
      accountNumber: formData.accountNumber,
      accountHolder: formData.accountHolder,
      contactInfo: formData.contactInfo,
      reservationFee: formData.reservationFee,
      startTime: formData.startTime || "",
      endTime: formData.endTime || "",
    },
  });

  const { register, handleSubmit, watch, setValue, trigger, reset, formState } =
    form;
  const { errors, isValid } = formState;

  // 편집 모드에서만 formData 변경 시 폼 리셋 (생성 모드에서는 사용자의 입력을 유지)
  useEffect(() => {
    if (!isEditMode) return;
    reset({
      name: formData.name,
      organizer: formData.organizer,
      description: formData.description,
      icon: formData.icon,
      totalCapacity: formData.totalCapacity,
      bankCode: formData.bankCode,
      accountNumber: formData.accountNumber,
      accountHolder: formData.accountHolder,
      contactInfo: formData.contactInfo,
      reservationFee: formData.reservationFee,
      startTime: formData.startTime || "",
      endTime: formData.endTime || "",
    });
  }, [formData, isEditMode, reset]);

  const onSubmit = (data: StoreFormData) => {
    setFormData({ ...formData, ...data });
    nextModal();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-primary-normal mb-[2px] text-xs">1단계</div>
      <div className="mb-10 text-xl font-medium">주점 정보를 입력해주세요</div>
      <div className="mb-10 flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
            <label className="font-medium">주점명</label>
          </div>
          <div>
            <input
              type="text"
              className="placeholder-color-neutral-90 w-full rounded-md border px-4 py-[14px] text-sm"
              placeholder="주점명을 입력하세요"
              {...register("name")}
              maxLength={28}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
            <label className="font-medium">운영 단체</label>
          </div>
          <div>
            <input
              type="text"
              className="placeholder-color-neutral-90 w-full rounded-md border px-4 py-[14px] text-sm"
              placeholder="동아리 등 단체명을 입력하세요"
              {...register("organizer")}
              maxLength={28}
            />
            {errors.organizer && (
              <p className="mt-1 text-xs text-red-500">
                {errors.organizer.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
            <label className="font-medium">상세 설명</label>
          </div>
          <div className="relative">
            <textarea
              className="placeholder-color-neutral-90 h-[118px] w-full resize-none rounded-md border px-4 py-[14px] text-sm"
              placeholder="상세 설명을 입력하세요"
              {...register("description")}
              maxLength={200}
            />
            <div className="text-color-neutral-60 absolute bottom-[14px] right-4 text-xs">
              {watch("description")?.length || 0}/200
            </div>
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <div className="flex items-center gap-2">
              <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
              <label className="font-medium">아이콘 선택</label>
            </div>
            <div className="text-color-neutral-50 text-xs">
              주점을 대표하는 아이콘을 선택해주세요!
            </div>
          </div>
          <ScrollArea>
            <div className="flex gap-2">
              {Icons.map((Icon, index) => (
                <div
                  key={index + 1}
                  className={cn(
                    "flex h-[74px] w-[74px] items-center justify-center rounded-lg border transition-colors",
                    watch("icon") === index + 1
                      ? "border-primary-normal bg-primary-normal"
                      : "border-color-neutral-95 bg-white"
                  )}
                  onClick={() => setValue("icon", index + 1)}
                >
                  <Icon
                    strokeColor={
                      watch("icon") === index + 1 ? "white" : "#FF5940"
                    }
                  />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
          </ScrollArea>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
            <label className="font-medium">총 좌석</label>
          </div>
          <div className="flex items-center gap-[14px]">
            <button
              type="button"
              className="rounded-xs border-color-neutral-95 flex h-[38px] w-[38px] items-center justify-center border"
              onClick={() => {
                const currentValue = watch("totalCapacity");
                if (currentValue > 0) {
                  setValue("totalCapacity", currentValue - 1);
                  trigger("totalCapacity");
                }
              }}
            >
              <Image src={MinusIcon} alt="minus" width={24} height={24} />
            </button>
            <span className="min-w-6 text-center font-medium">
              {watch("totalCapacity")}
            </span>
            <button
              type="button"
              className="rounded-xs border-color-neutral-95 flex h-[38px] w-[38px] items-center justify-center border"
              onClick={() => {
                const currentValue = watch("totalCapacity");
                setValue("totalCapacity", currentValue + 1);
                trigger("totalCapacity");
              }}
            >
              <Image src={PlusIcon} alt="plus" width={24} height={24} />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
            <label className="font-medium">입금받을 계좌</label>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex gap-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      "border-color-neutral-95 flex-1 justify-between border px-4 text-sm font-normal",
                      !watch("bankCode") && "text-color-neutral-90"
                    )}
                  >
                    {watch("bankCode")
                      ? BankCodes[watch("bankCode")]
                      : "은행을 선택하세요"}
                    <Image src={Arrow} alt="arrow" className="rotate-90" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="h-80 w-60">
                  <Command>
                    <CommandInput placeholder="은행을 검색하세요..." />
                    <CommandEmpty>은행을 찾을 수 없습니다.</CommandEmpty>
                    <ScrollArea className="h-64">
                      <CommandGroup>
                        {Object.entries(BankCodes).map(([code, name]) => (
                          <CommandItem
                            key={code}
                            value={name}
                            onSelect={() => {
                              setValue("bankCode", code);
                              trigger("bankCode");
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                watch("bankCode") === code
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </ScrollArea>
                  </Command>
                </PopoverContent>
              </Popover>
              <div>
                <input
                  type="text"
                  className="placeholder-color-neutral-90 w-[140px] rounded-md border px-4 py-[14px] text-sm"
                  placeholder="예금주명"
                  {...register("accountHolder")}
                  maxLength={4}
                />
                {errors.accountHolder && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.accountHolder.message}
                  </p>
                )}
              </div>
            </div>
            <div>
              <input
                type="text"
                inputMode="numeric"
                className="placeholder-color-neutral-90 w-full rounded-md border px-4 py-[14px] text-sm"
                placeholder="계좌번호를 입력하세요"
                {...register("accountNumber", {
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                    const numericValue = e.target.value.replace(/[^0-9]/g, "");
                    setValue("accountNumber", numericValue);
                  },
                })}
                maxLength={14}
              />
              {errors.accountNumber && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.accountNumber.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
            <label className="font-medium">예약비(원)</label>
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div>
              <input
                type="number"
                className="placeholder-color-neutral-90 w-full rounded-md border px-4 py-[14px] text-sm"
                placeholder="0"
                min="0"
                {...register("reservationFee", { valueAsNumber: true })}
              />
              {errors.reservationFee && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.reservationFee.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
            <label className="font-medium">연락 수단</label>
          </div>
          <div>
            <input
              type="text"
              className="placeholder-color-neutral-90 w-full rounded-md border px-4 py-[14px] text-sm"
              placeholder="전화번호 또는 SNS 주소를 입력하세요"
              {...register("contactInfo")}
              maxLength={20}
            />
            {errors.contactInfo && (
              <p className="mt-1 text-xs text-red-500">
                {errors.contactInfo.message}
              </p>
            )}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
            <label className="font-medium">대표 이미지 등록</label>
          </div>
          <div className="text-color-neutral-50 mb-2 text-xs">
            대표 이미지는 최대 1장 선택 가능합니다
          </div>
          <ImageUploadForm />
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
