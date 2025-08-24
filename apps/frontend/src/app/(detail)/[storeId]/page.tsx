import { MenuData, Store } from "@/app/type";
import cheerImg from "@/assets/cheers.png";
import bowlIcon from "@/assets/icon_bowl.svg";
import chipIcon from "@/assets/icon_chip.svg";

import drinkIcon from "@/assets/icon_drink.svg";

import riceIcon from "@/assets/icon_rice.svg";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { safeFetcher } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { renderStoreSummary } from "../components/store";

export default async function Page({
  params,
}: {
  params: { storeId: string };
}) {
  const storeId = params.storeId;
  const store: Store = await safeFetcher.get(`store/${storeId}`).json();
  const menuData: MenuData = await safeFetcher
    .get(`menu?storeId=${storeId}`)
    .json();
  const menus = menuData.Bap ?? [];

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
          <Link href={`/${storeId}/reservation`}>
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
      {renderStoreSummary({ store })}
      {renderDescription()}
    </div>
  );
}
