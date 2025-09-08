import { Separator } from "@/app/(main)/components/Separator";
import Image from "next/image";
import { safeFetcher } from "../../../lib/utils";
import { StoreDetail } from "../../type";
import { StoreInfo } from "../components/StoreInfo";
import { StoreActionButtons } from "./components/StoreActionButtons";

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
      <StoreActionButtons store={store} />
    </div>
  );
}
