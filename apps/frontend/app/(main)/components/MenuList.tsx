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
    <div className="py-5">
      <p className="px-5 text-lg font-medium">메뉴 미리보기</p>
      <Carousel opts={{ align: "start" }}>
        <CarouselContent className="my-[14px] ml-1 mr-5">
          {menus.map(menu => (
            <CarouselItem className="basis-auto" key={menu.id}>
              <MenuCard menu={menu} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
