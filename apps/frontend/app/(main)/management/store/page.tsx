import storeIcon from "@/public/icons/icon_orange_house.svg";
import Image from "next/image";
export default function Page() {
  return (
    <div>
      <div className="flex flex-col px-5 py-[30px]">
        <Image src={storeIcon} alt="Store Icon" width={32} height={32} />
      </div>
    </div>
  );
}
