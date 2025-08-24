import { Menu, Store } from "@/app/type";
import cheerImg from "@/assets/cheers.png";
import bowlIcon from "@/assets/icon_bowl.svg";
import chipIcon from "@/assets/icon_chip.svg";
import clockIcon from "@/assets/icon_clock.svg";
import drinkIcon from "@/assets/icon_drink.svg";
import locationIcon from "@/assets/icon_location.svg";
import moneyIcon from "@/assets/icon_money.svg";
import riceIcon from "@/assets/icon_rice.svg";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { dateFormatter, safeFetcher } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: { storeId: string };
}) {
  interface MenuData {
    Bap: Menu[];
  }
  const storeId = params.storeId;
  const store: Store = await safeFetcher.get(`store/${storeId}`).json();
  const menuData: MenuData = await safeFetcher
    .get(`menu?storeId=${storeId}`)
    .json();
  const menus = menuData.Bap ?? [];

  function renderStoreSummary() {
    return (
      <div className="p-5 pb-[30px] bg-white">
        <h2 className="text-xs font-normal text-primary-normal ">
          {store.name}
        </h2>
        <p className="text-xl font-medium mb-3">{store.description}</p>
        <div className="text-sm font-normal flex flex-col gap-1">
          <div className="flex justify-between">
            <div className="flex gap-1 items-center">
              <Image src={locationIcon} alt="Location" className="w-4 h-4" />
              <span>위치</span>
            </div>
            <span>{store.name}</span>
          </div>
          <div className="flex justify-between">
            <div className="flex gap-1 items-center">
              <Image src={clockIcon} alt="Clock" className="w-4 h-3" />
              <span>운영 시간</span>
            </div>
            <span>
              {dateFormatter(store.startTime, "HH:mm")} ~{" "}
              {dateFormatter(store.endTime, "HH:mm")}
            </span>
          </div>
          <div className="flex justify-between mb-3">
            <div className="flex gap-1 items-center">
              <Image src={moneyIcon} alt="Money" className="w-4 h-4" />
              <span>입장료</span>
            </div>
            <span>인당 {store.reservationFee}</span>
          </div>
          <div className="flex rounded-md justify-between px-4 py-3 bg-color-neutral-99 text-base font-normal ">
            <div className="flex gap-2 items-center">
              <div className="rounded-full bg-primary-normal w-1.5 h-1.5" />
              <span>현재 예약 가능한 인원</span>
            </div>
            <span className="text-primary-normal">13명</span>
          </div>
        </div>
      </div>
    );
  }
  function renderDescription() {
    return (
      <div className="bg-white">
        <div className="p-5 mt-[10px] text-sm font-normal  text-color-neutral-40">
          {store.description}
        </div>
        <div className="p-5 text-xl font-medium">
          <p>메뉴</p>
          <div>
            <Carousel>
              <CarouselContent className="-ml-2 my-[14px]">
                {menus.map((menu) => (
                  <CarouselItem className="pl-4" key={menu.id}>
                    <MenuCard name={menu.name} id={menu.id} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </div>
        <div className="p-5">
          <Link href={`/reservation`}>
            <Button className="w-full  bg-primary-normal h-[50px] px-4 py-[14px]">
              예약하기
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  interface MenuCardProps {
    id: number;
    name: string;
  }

  function MenuCard({ id, name }: MenuCardProps) {
    return (
      <div className="h-[96px] flex flex-col justify-between w-[88px] bg-color-neutral-99 py-4">
        <Image
          src={
            id % 4 === 0
              ? bowlIcon
              : id % 4 === 1
                ? chipIcon
                : id % 4 === 2
                  ? drinkIcon
                  : riceIcon
          }
          alt="Menu Item"
          className="w-4 h-4"
        />
        {name}
      </div>
    );
  }

  return (
    <div>
      <div className="h-4 bg-white" />
      <Image src={cheerImg} alt="Description" className="w-full h-[257px]" />
      {renderStoreSummary()}
      {renderDescription()}
    </div>
  );
}
