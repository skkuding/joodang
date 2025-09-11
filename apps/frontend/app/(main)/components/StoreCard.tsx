import {
  BagIcon,
  DumbbellIcon,
  HeartIcon,
  HospitalIcon,
  HouseIcon,
  KeyIcon,
  LeafIcon,
  MonitorIcon,
  NoodleIcon,
  PawIcon,
} from "@/app/components/StoreIcons";
import { dateFormatter } from "@/lib/utils";
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
  icon?: number;
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
  icon,
}: StoreCardProps) {
  function getCategoryIcon(icon: number | undefined) {
    switch (icon) {
      case 1:
        return <PawIcon strokeColor="#FF5940" width={40} height={40} />;
      case 2:
        return <HeartIcon strokeColor="#FF5940" width={40} height={40} />; // Replace with actual icon
      case 3:
        return <NoodleIcon strokeColor="#FF5940" width={40} height={40} />; // Replace with actual icon
      case 4:
        return <LeafIcon strokeColor="#FF5940" width={40} height={40} />; // Replace with actual icon
      case 5:
        return <DumbbellIcon strokeColor="#FF5940" width={40} height={40} />; // Replace with actual icon
      case 6:
        return <BagIcon strokeColor="#FF5940" width={40} height={40} />; // Replace with actual icon
      case 7:
        return <MonitorIcon strokeColor="#FF5940" width={40} height={40} />; // Replace with actual icon
      case 8:
        return <HospitalIcon strokeColor="#FF5940" width={40} height={40} />; // Replace with actual icon
      case 9:
        return <HouseIcon strokeColor="#FF5940" width={40} height={40} />; // Replace with actual icon
      case 10:
        return <KeyIcon strokeColor="#FF5940" width={40} height={40} />; // Replace with actual icon
      default:
        return <PawIcon strokeColor="#FF5940" width={40} height={40} />; // Default icon
    }
  }

  const CardContent = () => (
    <>
      {size === "large" ? (
        <div
          className={`} flex h-[178px] w-[170px] flex-col justify-between rounded-md p-5 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.10)]`}
        >
          <div className="flex justify-end">{getCategoryIcon(icon)}</div>
          <div>
            <p className="text-primary-normal truncate text-[13px] font-medium">
              {clubName}
            </p>
            <p className="truncate text-base font-medium">{storeName}</p>
            <span className="text-color-neutral-50 text-sm font-normal">
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
