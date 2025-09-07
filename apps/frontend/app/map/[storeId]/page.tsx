import SingleStoreMap from "@/app/map/[storeId]/_components/SingleStoreMap";
import { safeFetcher } from "@/lib/utils";
import type { StoreDetail } from "@/app/type";

export default async function MapPageforSingleStore() {
  const storeId = 1; // Example storeId, replace with actual value as needed
  const store: StoreDetail = await safeFetcher(`store/${storeId}`).json();
  console.log("store data", store);

  return (
    <div>
      <SingleStoreMap store={store} />
    </div>
  );
}
