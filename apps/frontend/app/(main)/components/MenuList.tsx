"use client";

import { Menu } from "@/app/type";
import { safeFetcher } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem } from "@/ui/carousel";
import { useEffect, useState } from "react";
import { MenuCard } from "./MenuCard";

export function MenuList({ storeId }: { storeId: number }) {
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    const fetchMenus = async () => {
      const menus: Menu[] = await safeFetcher(`menu?storeId=${storeId}`).json();
      setMenus(menus);
    };
    fetchMenus();
  }, []);

  return (
    <div className="bg-amber-200 p-5">
      <p className="text-lg font-medium">메뉴 미리보기</p>
      <Carousel opts={{ align: "start" }}>
        <CarouselContent className="my-[14px] ml-1">
          {menus.map(menu => (
            <CarouselItem className="basis-auto" key={menu.id}>
              <MenuCard />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
