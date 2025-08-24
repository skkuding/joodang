"use client";
import { MenuData, Store } from "@/app/type";
import minusIcon from "@/assets/icon_minus.svg";
import plusIcon from "@/assets/icon_plus.svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { safeFetcher } from "@/lib/utils";
import { queryOptions, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { renderStoreSummary } from "../../components/store";

export default function Page() {
  const { storeId } = useParams();
  const { data: store } = useQuery(
    queryOptions<Store>({
      queryKey: ["store", storeId],
      queryFn: () => {
        return safeFetcher.get(`store/${storeId}`).json() as Promise<Store>;
      },
    }),
  );
  const { data: menuData } = useQuery(
    queryOptions({
      queryKey: ["menu", storeId],
      queryFn: () =>
        safeFetcher.get(`menu?storeId=${storeId}`).json() as Promise<MenuData>,
    }),
  );
  const [count, setCount] = useState(0);

  function Form({
    title,
    description,
    children,
    isRow = false,
  }: {
    title: string;
    description?: string;
    children: React.ReactNode;
    isRow?: boolean;
  }) {
    return (
      <div className={`flex ${isRow ? "justify-between" : "flex-col"} gap-3`}>
        <div className="flex gap-2 text-base font-medium items-center">
          <div className="rounded-full bg-primary-normal w-1.5 h-1.5" />
          {title}
        </div>
        {description && (
          <span className=" text-xs font-normal text-color-neutral-50">
            {description}
          </span>
        )}
        {children}
      </div>
    );
  }

  function getDateRange(start: string, end: string) {
    const startDate = dayjs(start);
    const endDate = dayjs(end);
    const dates: string[] = [];
    let current = startDate;
    while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
      dates.push(
        current
          .format("YYYY년 MM월 DD일 (dd)")
          .replace("(Su)", "(일)")
          .replace("(Mo)", "(월)")
          .replace("(Tu)", "(화)")
          .replace("(We)", "(수)")
          .replace("(Th)", "(목)")
          .replace("(Fr)", "(금)")
          .replace("(Sa)", "(토)"),
      );
      current = current.add(1, "day");
    }
    return dates;
  }

  function renderReservationForm() {
    if (!store) {
      return;
    }
    const dates = getDateRange(store.startTime, store.endTime);
    return (
      <div className="p-5 bg-white mt-[10px]">
        <Form title="날짜">
          <div className="grid grid-cols-2 gap-2">
            {dates.map((date) => (
              <Button
                key={date}
                type="button"
                className="px-4 py-2 rounded border border-color-neutral-40 bg-white text-color-neutral-80"
              >
                {date}
              </Button>
            ))}
          </div>
        </Form>
        <Form title="시간대">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-[52px] justify-between items-center pl-5 pr-[14px] border rounded-md border-color-neutral-99">
              <span className="text-xl font-semibold">성균관대학교</span>
              <IoIosArrowDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
              <DropdownMenuLabel>성균관대학교</DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </Form>
        <Form title="총 인원" isRow>
          <div className="flex items-center gap-5">
            <Button variant="outline" className="p-[7px] w-[38px] h-[38px]">
              <Image
                src={plusIcon}
                alt="Add"
                onClick={() => setCount((prev) => prev + 1)}
              />
            </Button>
            <span className="text-base font-medium">{count}</span>
            <Button variant="outline" className="p-[7px] w-[38px] h-[38px]">
              <Image
                src={minusIcon}
                alt="Remove"
                onClick={() => setCount((prev) => Math.max(prev - 1, 0))}
              />
            </Button>
          </div>
        </Form>
        <Form
          title="메뉴 선예약"
          description="메뉴는 당일 현장에서 주문도 가능합니다"
        >
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-[52px] justify-between items-center pl-5 pr-[14px] border rounded-md border-color-neutral-99">
              <span className="text-xl font-semibold">성균관대학교</span>
              <IoIosArrowDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
              <DropdownMenuLabel>성균관대학교</DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </Form>
      </div>
    );
  }
  return (
    <div>
      <div className="h-4 bg-white" />
      {store && renderStoreSummary({ store })}
      {renderReservationForm()}
    </div>
  );
}
