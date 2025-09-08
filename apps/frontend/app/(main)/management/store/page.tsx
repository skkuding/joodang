import { Button } from "@/components/ui/button";
import storeIcon from "@/public/icons/icon_orange_store.svg";
import Image from "next/image";
import { Separator } from "../../components/Separator";
import { MyStore } from "./MyStore";
export default function Page() {
  function RegisterStore() {
    return (
      <div className="flex flex-col px-5 py-[30px]">
        <Image src={storeIcon} alt="Store Icon" />
        <div className="flex justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xl font-medium">주점을 관리해보세요</span>
            <span className="text-sm font-normal">
              주당이 손쉬운 주점 관리를 도와드릴게요!
            </span>
          </div>
          <Button className="w-20" size={"sm"}>
            등록하기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <RegisterStore />
      <Separator />
      <MyStore />
    </div>
  );
}
