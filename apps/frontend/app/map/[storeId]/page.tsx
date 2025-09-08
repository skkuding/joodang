import SingleStoreMap from "@/app/map/[storeId]/_components/SingleStoreMap";
import type { StoreDetail } from "@/app/type";
import { safeFetcher } from "@/lib/utils";

export default async function MapPageforSingleStore({
  params,
}: {
  params: { storeId: string };
}) {
  const storeId = await params.storeId;
  const store: StoreDetail = await safeFetcher(`store/${storeId}`).json();

  return (
    <div>
      <SingleStoreMap store={store} />
    </div>
  );
}
