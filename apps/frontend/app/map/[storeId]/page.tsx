import SingleStoreMap from "@/app/map/[storeId]/_components/SingleStoreMap";
import type { StoreDetail } from "@/app/type";
import { safeFetcher } from "@/lib/utils";

export default async function MapPageforSingleStore() {
  const storeId = 1; // Example storeId, replace with actual value as needed
  const store: StoreDetail = await safeFetcher(`store/${storeId}`).json();
  // console.log("store data", store);

  return (
    <div>
      <SingleStoreMap store={store} />
    </div>
  );
}
