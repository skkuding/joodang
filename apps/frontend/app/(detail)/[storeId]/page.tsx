import { Separator } from "@/app/(main)/components/Separator";
import { Button } from "@/components/ui/button";
import bowlIcon from "@/public/icons/icon_bowl.svg";
import chipIcon from "@/public/icons/icon_chip.svg";
import drinkIcon from "@/public/icons/icon_drink.svg";
import riceIcon from "@/public/icons/icon_rice.svg";
import cheerImg from "@/public/pictures/cheers.png";
import Image from "next/image";
import { safeFetcher } from "../../../lib/utils";
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

  function StoreDescription() {
    return (
      <div className="text-color-neutral-30 p-5 text-sm font-normal">
        {store.description}
      </div>
    );
  }

  function ReservationButton() {
    return (
      <div className="pb-15 fixed bottom-0 left-0 right-0 bg-white p-5">
        <Button className="w-full">예약하기</Button>
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
      <Separator />
      <StoreDescription />
      <ReservationButton />
    </div>
  );
}
