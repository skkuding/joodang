"use client";

import { ReservationResponse, Store } from "@/app/type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDateDash2Point, safeFetcher } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import ReservationListItem from "./ReservationListItem";

export function ReservationList() {
  const [reservations, setReservations] = useState<
    ReservationResponse[] | null
  >(null);
  const getStoreReservations = useCallback(async (storeId: number) => {
    const reservationRes: ReservationResponse[] = await safeFetcher
      .get(`reservation/store/${storeId}`)
      .json();
    if (reservationRes) {
      setReservations(reservationRes);
    }
    console.log("res: ", reservationRes);
  }, []);

  const fetchStores = useCallback(async () => {
    const myStores: Store[] = await safeFetcher.get("store?sort=my").json();
    setStores(myStores);
  }, []);

  const [stores, setStores] = useState<Store[] | null>(null);
  const [selStore, setSelStore] = useState<number>(0);

  useEffect(() => {
    fetchStores();
    getStoreReservations(13);
  }, []);

  return (
    <div className="flex flex-col space-y-[14px] px-5 pt-[30px]">
      <div className="text-color-common-0 justify-start text-xl font-medium leading-7">
        우리 주점을 예약했어요
      </div>
      <div className="w-full text-sm">
        {stores && stores.length > 0 && (
          <Select defaultValue={String(stores[0].id)}>
            <SelectTrigger className="flex h-[62px] w-full rounded-[6px]">
              <SelectValue placeholder="예약을 선택하세요" />
            </SelectTrigger>
            <SelectContent className="w-full">
              {stores &&
                stores.map((store, idx) => {
                  return (
                    <SelectItem
                      value={String(store.id)}
                      className="flex flex-row py-3 pl-[14px] pr-4 data-[state=checked]:bg-[#FF59401A]"
                      key={idx}
                      onClick={() => {
                        setSelStore(store.id);
                      }}
                    >
                      <div className="flex flex-col">
                        <p className="text-color-common-0 flex flex-row text-sm font-normal leading-tight">
                          {store.name}
                        </p>
                        <p className="text-primary-normal text-xs font-normal leading-none">
                          {formatDateDash2Point(store.startTime.slice(0, 10))} ~{" "}
                          {formatDateDash2Point(store.endTime.slice(0, 10))}
                        </p>
                      </div>
                    </SelectItem>
                  );
                })}
            </SelectContent>
          </Select>
        )}
      </div>

      <div>
        {reservations &&
          reservations.map((reservation, idx) => {
            if (reservation.storeId !== selStore) {
              return;
            }
            return <ReservationListItem reservation={reservation} key={idx} />;
          })}
      </div>
    </div>
  );
}
