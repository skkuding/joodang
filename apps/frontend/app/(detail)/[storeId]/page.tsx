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
      <div className="text-color-neutral-30 mb-25 p-5 text-sm font-normal">
        {store.description}
      </div>
    );
  }

  function ReservationButton() {
    return (
      <div className="fixed bottom-0 left-0 right-0 flex flex-col gap-[6px] rounded-lg bg-white p-5 pb-5 shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
        <Link href={`/${storeId}/reservation`}>
          <Button className="w-full">예약하기</Button>
        </Link>
        <StandByButton />
      </div>
    );
  }

  function StoreImage() {
    return (
      <Image
        src={store.imageUrl}
        alt="Description"
        width={800}
        height={240}
        className="h-[240px] w-full object-cover object-center"
      />
    );
  }

  return (
    <div>
      <StoreImage />
      <StoreInfo store={store} />
      <Separator />
      <StoreDescription />
      <ReservationButton />
    </div>
  );
}
