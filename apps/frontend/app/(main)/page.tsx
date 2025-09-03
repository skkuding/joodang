"use client";
import { useEffect, useState } from "react";
import { IoIosRefresh } from "react-icons/io";
import { formatDateWithDay, safeFetcher } from "../../lib/utils";
import { Carousel, CarouselContent, CarouselItem } from "../../ui/carousel";
import NaverMap from "../components/NaverMap";
import { Store } from "../type";
import { Section } from "./components/Section";
import { Separator } from "./components/Separator";
import { StoreCard } from "./components/StoreCard";

export default function Home() {
  const [stores, setStores] = useState<Store[]>([]);
  const fetchStores = async () => {
    const stores: Store[] = await safeFetcher("store").json();
    setStores(stores);
  };
  useEffect(() => {
    fetchStores();
  }, []);

  function Banner() {
    return (
      <div className="h-[139px] p-5">
        <div className="bg-color-neutral-20 flex flex-col rounded-md px-5 py-4">
          <span className="text-primary-normal text-xs font-normal">
            {formatDateWithDay(new Date())}
          </span>
          <span className="text-color-common-100 text-lg font-medium">
            성균관대학교 대동제
          </span>
          <span className="text-color-neutral-80 text-sm font-normal">
            오늘은 대동제가 열려요! 함께 축제를 즐겨볼까요?
          </span>
        </div>
      </div>
    );
  }

  function StoreList() {
    return (
      <Section title="오늘의 인기 주점" route="/find">
        <div className="flex flex-col">
          <div className="text-color-neutral-60 flex items-center gap-1 text-sm font-normal">
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

  function StoreLocation() {
    return (
      <Section title="주점 위치를 알아볼까요?" route="/location">
        <div className="">
          {<NaverMap />}
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
                    size="medium"
                    location={store.location}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </Section>
    );
  }

  return (
    <div className="flex flex-col pt-8">
      <Banner />
      <Separator />
      <StoreList />
      <Separator />
      <StoreLocation />
    </div>
  );
}
