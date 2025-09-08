"use client";
import { useCallback, useEffect, useState } from "react";
import { safeFetcher } from "../../lib/utils";
import { CarouselApi } from "../../ui/carousel";
import { Store } from "../type";
import { Banner } from "./components/Banner";
import { Separator } from "./components/Separator";
import { StoreList } from "./components/StoreList";
import { StoreLocation } from "./components/StoreLocation";

export default function Home() {
  const [api, setApi] = useState<CarouselApi>();
  const [stores, setStores] = useState<Store[]>([]);
  const [current, setCurrent] = useState<number>(0);

  const fetchStores = useCallback(async () => {
    const stores: Store[] = await safeFetcher("store").json();
    setStores(stores.slice(0, 8));
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap() + 1);
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className="flex flex-col">
      <Banner />
      <Separator />
      <StoreList />
      <Separator />
      <StoreLocation />
    </div>
  );
}
