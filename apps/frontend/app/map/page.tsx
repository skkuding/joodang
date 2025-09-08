import MultiStoreMap from "./[storeId]/_components/MultiStoreMap";
import { safeFetcher } from "@/lib/utils";
import type { Store } from "../type";

export default async function MapPageforSingleStore() {
  const store: Store[] = await safeFetcher(`store`).json();

  return (
    <div>
      <MultiStoreMap stores={store} />
    </div>
  );
}
