import { Separator } from "@/app/(main)/components/Separator";
import { Button } from "@/components/ui/button";
import cheerImg from "@/public/pictures/cheers.png";
import Image from "next/image";
import Link from "next/link";
import { safeFetcher } from "../../../lib/utils";
import { StoreDetail } from "../../type";
import { StoreInfo } from "../components/StoreInfo";
import { StandByButton } from "./components/StandByButton";

export default async function Page({
  params,
}: {
  params: { storeId: string };
}) {
  const storeId = params.storeId;
  const store: StoreDetail = await safeFetcher.get(`store/${storeId}`).json();

  function StoreDescription() {
    return (
      <div className="text-color-neutral-30 p-5 text-sm font-normal">
        {store.description}
      </div>
    );
  }

  function ReservationButton() {
    return (
      <div className="pb-15 fixed bottom-0 left-0 right-0 flex flex-col gap-[6px] p-5">
        <Link href={`/${storeId}/reservation`}>
          <Button className="w-full">예약하기</Button>
        </Link>
        <StandByButton />
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
