import bowlIcon from "@/public/icons/icon_bowl.svg";
import chipIcon from "@/public/icons/icon_chip.svg";
import drinkIcon from "@/public/icons/icon_drink.svg";
import riceIcon from "@/public/icons/icon_rice.svg";
import cheerImg from "@/public/pictures/cheers.png";
import Image from "next/image";
import Link from "next/link";
import { safeFetcher } from "../../../lib/utils";
import { Button } from "../../../ui/button";
import { Carousel, CarouselContent, CarouselItem } from "../../../ui/carousel";
import { Menu, StoreDetail } from "../../type";
import { renderStoreSummary } from "../components/store";

export default async function Page({
  params,
}: {
  params: { storeId: string };
}) {
  const storeId = params.storeId;
  const store: StoreDetail = await safeFetcher.get(`store/${storeId}`).json();

  const menus: Menu[] = [
    {
      id: 1,
      name: "밥",
      photoUrl: null,
      price: 0,
      category: "",
      storeId: 0,
    },
    {
      id: 2,
      name: "김치찌개",
      photoUrl: null,
      price: 0,
      category: "",
      storeId: 0,
    },
    {
      id: 3,
      name: "된장찌개",
      photoUrl: null,
      price: 0,
      category: "",
      storeId: 0,
    },
    {
      id: 4,
      name: "불고기",
      photoUrl: null,
      price: 0,
      category: "",
      storeId: 0,
    },
  ];

  function renderDescription() {
    return (
      <div className="bg-white">
        <div className="p-5 mt-[10px] text-sm font-normal  text-color-neutral-40">
          {store.description}
        </div>
        <div className="p-5 text-xl font-medium">
          <p>메뉴</p>
          <Carousel>
            <CarouselContent className="-ml-2 my-[14px]">
              {menus.map((menu) => (
                <CarouselItem className="basis-auto" key={menu.id}>
                  <MenuCard name={menu.name} id={menu.id} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <div className="p-5">
          <Link href={`/${storeId}/reservation`}>
            <Button className="w-full  bg-primary-normal h-[50px] px-4 py-[14px] text-base font-medium">
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
      <div className="h-[96px] text-base font-normal flex flex-col items-center justify-between w-[88px] bg-color-neutral-99 py-4">
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
          className="w-8 h-8 "
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
