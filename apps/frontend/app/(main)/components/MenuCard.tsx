import {
  BapIcon,
  BeverageIcon,
  FruitIcon,
  Maroon5Icon,
  TangIcon,
  TuiguimIcon,
} from "@/app/components/Icons";
import { Menu } from "@/app/type";
import { mapEnumToCategory, MenuCategory } from "@/lib/utils/store-utils";
import Image from "next/image";

export function MenuCard({ menu }: { menu: Menu }) {
  function mapCategoryToIcon(category: MenuCategory) {
    switch (category) {
      case MenuCategory.Tang:
        return <TangIcon className="fill-primary-normal" />;
      case MenuCategory.Tuiguim:
        return <TuiguimIcon className="fill-primary-normal" />;
      case MenuCategory.Bap:
        return <BapIcon className="fill-primary-normal" />;
      case MenuCategory.Fruit:
        return <FruitIcon className="fill-primary-normal" />;
      case MenuCategory.Maroon5:
        return <Maroon5Icon className="fill-primary-normal" />;
      case MenuCategory.Beverage:
        return <BeverageIcon className="fill-primary-normal" />;
      default:
        return null;
    }
  }

  return (
    <div className="h-[190px] w-60 rounded-md shadow-[0px_0px_20px_0px_rgba(0,0,0,0.08)]">
      {menu.imageUrl && (
        <Image
          src={menu.imageUrl}
          alt="Menu Image"
          className="h-[105px] rounded-t-md object-cover object-center"
          height={100}
          width={335}
        />
      )}

      <div className="px-4 pb-6 pt-3">
        <span className="bg-primary-normal/10 text-primary-normal flex w-fit p-1 py-[2px] text-xs font-normal">
          {mapCategoryToIcon(menu.category)}
          {mapEnumToCategory(menu.category)}
        </span>
        <div className="flex justify-between pt-2">
          <p className="text-base font-normal">{menu.name}</p>
          <p className="text-primary-normal text-base font-medium">
            {menu.price}원
          </p>
        </div>
      </div>
    </div>
  );
}
