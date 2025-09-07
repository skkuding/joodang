"use client";
import { Store } from "@/app/type";
import { formatDateWithDay, safeFetcher } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem } from "@/ui/carousel";
import { useCallback, useEffect, useState } from "react";
import { IoIosRefresh } from "react-icons/io";
import { Section } from "./Section";
import { StoreCard } from "./StoreCard";

export function StoreList() {
  const [stores, setStores] = useState<Store[]>([]);
  const fetchStores = useCallback(async () => {
    const stores: Store[] = await safeFetcher("store").json();
    setStores(stores.slice(0, 8));
  }, []);
  useEffect(() => {
    fetchStores();
  }, []);
  return (
    <Section title="오늘의 인기 주점" route="/find">
      <div className="flex flex-col">
        <div className="text-color-neutral-60 flex items-center gap-1 px-5 text-sm font-normal">
          {formatDateWithDay(new Date())}
          <IoIosRefresh className="h-3.5 w-3.5" onClick={fetchStores} />
        </div>
        <Carousel opts={{ align: "start" }}>
          <CarouselContent className="my-[14px] -ml-2 sm:-ml-4">
            {stores.map(store => (
              <CarouselItem className="basis-auto" key={store.id}>
                <StoreCard
                  id={store.id}
                  clubName={store.organizer}
                  storeName={store.name}
                  startTime={new Date(store.startTime)}
                  endTime={new Date(store.endTime)}
                  size={"large"}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </Section>
  );
}
