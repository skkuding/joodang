"use client";
import { safeFetcher } from "@/lib/utils";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/ui/carousel";
import { useCallback, useEffect, useState } from "react";
import { Store } from "../../type";
import { StoreCard } from "./StoreCard";
import StoreMap from "./StoreMap";

export function StoreLocation() {
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
    <div className="flex w-full flex-col justify-center">
      <StoreMap stores={stores} current={current} />
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          slidesToScroll: 1,
          containScroll: "trimSnaps",
        }}
      >
        <CarouselContent className="my-[14px] -ml-2 sm:-ml-4">
          {stores.map(store => (
            <CarouselItem className="basis-auto" key={store.id}>
              <StoreCard
                id={store.id}
                clubName={store.organizer}
                storeName={store.name}
                startTime={new Date(store.startTime)}
                endTime={new Date(store.endTime)}
                size="medium"
                location={store.location}
                disabled
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
