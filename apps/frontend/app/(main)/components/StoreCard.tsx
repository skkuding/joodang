import { dateFormatter } from "@/lib/utils";
import animalIcon from "@/public/icons/icon_aninal.svg";
import foodIcon from "@/public/icons/icon_food.svg";
import heartIcon from "@/public/icons/icon_heart.svg";
import Image from "next/image";
import Link from "next/link";
import { FaLocationDot } from "react-icons/fa6";
interface StoreCardProps {
  id: number;
  clubName: string;
  storeName: string;
  location?: string;
  startTime: Date;
  endTime: Date;
  size: "medium" | "large";
  disabled?: boolean;
}

export function StoreCard({
  id,
  clubName,
  storeName,
  location,
  startTime,
  endTime,
  size = "large",
  disabled,
}: StoreCardProps) {
  const CardContent = () => (
    <>
      {size === "large" ? (
        <div
          className={`} flex h-[178px] w-[170px] flex-col justify-between rounded-md p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.10)]`}
        >
          <div className="flex justify-end">
            <Image
              src={
                id % 3 === 0 ? animalIcon : id % 3 === 1 ? heartIcon : foodIcon
              }
              alt={`index-${id}`}
              className="h-[40.50px] w-[48.60px]"
            />
          </div>
          <div>
            <p className="text-primary-normal text-[13px] font-semibold">
              {clubName}
            </p>
            <p className="truncate text-lg font-semibold">{storeName}</p>
            <span className="text-sm font-medium">
              {dateFormatter(startTime, "YYYY.MM.DD")} -{" "}
              {dateFormatter(endTime, "DD")}
            </span>
          </div>
        </div>
      ) : (
        <div
          className={`} flex h-[103px] w-[220px] flex-col justify-between rounded-md p-[14px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.12)]`}
        >
          <div>
            <h3 className="text-primary-normal text-[13px] font-semibold">
              {clubName}
            </h3>
            <h3 className="mb-1 truncate text-base font-semibold">
              {storeName}
            </h3>
            <div className="text-color-neutral-40 bg-color-neutral-99 flex items-center gap-1 p-1 text-sm font-medium">
              <FaLocationDot className="text-color-neutral-80 h-4 w-4" />
              {location}
            </div>
          </div>
        </div>
      )}
    </>
  );

  return disabled ? (
    <CardContent />
  ) : (
    <Link href={`/${id}`}>
      <CardContent />
    </Link>
  );
}
