"use client";
import { FormSection } from "@/app/components/FormSection";
import { StoreDetail } from "@/app/type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { formatDateWithDay, safeFetcher } from "@/lib/utils";
import kakaoIcon from "@/public/icons/icon_kakao.svg";
import minusIcon from "@/public/icons/icon_minus.svg";
import plusIcon from "@/public/icons/icon_plus.svg";
import logoSymbol from "@/public/logo_symbol.svg";
import logoText from "@/public/logo_text.svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import Link from "next/dist/client/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

export default function Page() {
  const { storeId } = useParams();

  const [count, setCount] = useState(0);
  const [store, setStore] = useState<StoreDetail | null>(null);
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
    if (!store) {
      return;
    }

    return (
      <div className="flex flex-col gap-10 p-5">
        <FormSection title="날짜">
          <div className="grid grid-cols-2 gap-2">
            {store.timeSlots
              .reduce(
                (uniqueDates, slot) => {
                  const dateKey = new Date(slot.startTime).toDateString();
                  if (
                    !uniqueDates.find(
                      item =>
                        new Date(item.startTime).toDateString() === dateKey
                    )
                  ) {
                    uniqueDates.push(slot);
                  }
                  return uniqueDates;
                },
                [] as typeof store.timeSlots
              )
              .map(date => (
                <Button
                  key={date.id}
                  variant="outline"
                  className="h-[37px]"
                  disabled={date.availableSeats === 0}
                >
                  <span className="text-sm font-normal">
                    {formatDateWithDay(date.startTime)}
                  </span>
                </Button>
              ))}
          </div>
        </FormSection>
        <FormSection title="시간대">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-[52px] items-center justify-between rounded-md border pl-5 pr-[14px]">
              <span className="text-xl font-semibold">성균관대학교</span>
              <IoIosArrowDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
              {store.timeSlots.map(slot => (
                <DropdownMenuLabel key={slot.id}>
                  {`${slot.startTime} - ${slot.endTime} (${slot.availableSeats}석 남음)`}
                </DropdownMenuLabel>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </FormSection>
        <FormSection title="총 인원" isRow>
          <div className="flex items-center gap-5">
            <Button variant="outline" className="h-[38px] w-[38px] p-[7px]">
              <Image
                src={plusIcon}
                alt="Add"
                onClick={() => setCount(prev => prev + 1)}
              />
            </Button>
            <span className="text-base font-medium">{count}</span>
            <Button variant="outline" className="h-[38px] w-[38px] p-[7px]">
              <Image
                src={minusIcon}
                alt="Remove"
                onClick={() => setCount(prev => Math.max(prev - 1, 0))}
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
            <Input type="number" />
            <Input type="number" />
          </div>
        </FormSection>
      </div>
    );
  }

  function SubmitButton() {
    return (
      <div className="pb-15 fixed bottom-0 left-0 right-0 bg-white p-5">
        <Link href={`/${storeId}/reservation`}>
          <Button className="w-full" type="submit">
            예약하기
          </Button>
        </Link>
      </div>
    );
  }

  if (!store) {
    return;
  }
  return (
    <div className="w-full">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Open</Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-5/6 rounded-t-2xl">
          <SheetHeader>
            <SheetTitle className="hidden" />
          </SheetHeader>
          <div className="flex h-full flex-col items-center justify-center px-5">
            <div className="mb-4 flex gap-[5.54px]">
              <Image src={logoSymbol} alt="Logo Symbol" />
              <Image src={logoText} alt="Logo Text" />
            </div>
            <p className="mb-10 text-center">
              간편하게 로그인하고 <br />
              다양한 서비스를 이용해보세요
            </p>
            <Button
              className="h-[55px] w-full rounded bg-[#fee500] text-black"
              onClick={() => (window.location.href = "/api/auth/kakao")}
            >
              <Image src={kakaoIcon} alt="Kakao Icon" />
              <span>카카오 로그인/회원가입</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
      {/* <div className="h-4" />
      <StoreInfo store={store} />
      <Separator />
      <ReservationForm />
      <SubmitButton /> */}
    </div>
  );
}
