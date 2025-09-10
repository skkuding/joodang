"use client";

import { Menu } from "@/app/type";
import { safeFetcher } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem } from "@/ui/carousel";
import { useEffect, useState } from "react";
import { MenuCard } from "./MenuCard";
import { MenuCategory } from "@/lib/utils/store-utils";

export function MenuList({ storeId }: { storeId: number }) {
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    const fetchMenus = async () => {
      const menus: Menu[] = await safeFetcher(`menu?storeId=${storeId}`).json();

      const categoryOrder = [
        MenuCategory.Tang,
        MenuCategory.Tuiguim,
        MenuCategory.Bap,
        MenuCategory.Fruit,
        MenuCategory.Maroon5,
        MenuCategory.Beverage,
      ];

      const sortedMenus = menus.sort((a, b) => {
        const aIndex = categoryOrder.indexOf(a.category);
        const bIndex = categoryOrder.indexOf(b.category);

        if (aIndex === -1 && bIndex === -1) return 0;
        if (aIndex === -1) return 1;
        if (bIndex === -1) return -1;

        return aIndex - bIndex;
      });

      setMenus(sortedMenus);
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
