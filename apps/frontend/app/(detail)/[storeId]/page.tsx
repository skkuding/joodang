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
import { StoreInfo } from "../components/StoreInfo";

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
        <div className="text-color-neutral-40 mt-[10px] p-5 text-sm font-normal">
          {store.description}
        </div>
        <div className="p-5 text-xl font-medium">
          <p>메뉴</p>
          <Carousel>
            <CarouselContent className="my-[14px] -ml-2">
              {menus.map(menu => (
                <CarouselItem className="basis-auto" key={menu.id}>
                  <MenuCard name={menu.name} id={menu.id} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <div className="p-5">
          <Link href={`/${storeId}/reservation`}>
            <Button className="bg-primary-normal h-[50px] w-full px-4 py-[14px] text-base font-medium">
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
      <div className="bg-color-neutral-99 flex h-[96px] w-[88px] flex-col items-center justify-between py-4 text-base font-normal">
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
          className="h-8 w-8"
        />
        {name}
      </div>
    );
  }

  function StoreImage() {
    return (
      <Image src={cheerImg} alt="Description" className="h-[240px] w-full" />
    );
  }

  return (
    <div className="pt-10">
      <StoreImage />
      <StoreInfo store={store} />
      {renderDescription()}
    </div>
  );
}
