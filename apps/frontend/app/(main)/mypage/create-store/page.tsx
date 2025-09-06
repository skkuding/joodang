"use client";

import { Progress } from "@/components/ui/progress";
import { useCreateStoreStore } from "@/app/stores/createStore";
import StoreInfoForm from "./_components/StoreInfoForm";
import TimeSlotForm from "./_components/TimeSlotForm";
import LocationForm from "./_components/LocationForm";
import MenuForm from "./_components/MenuForm";
import { DetailHeader } from "../../../components/DetailHeader";
import { useEffect } from "react";

export default function Page() {
  const { modalPage, setModalPage } = useCreateStoreStore(state => state);

  useEffect(() => {
    const handlePopState = () => {
      if (modalPage > 0) {
        setModalPage(0);
        window.history.pushState(null, "", window.location.href);
      }
    };

    window.addEventListener("popstate", handlePopState);

    window.history.pushState(null, "", window.location.href);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [modalPage, setModalPage]);
  return (
    <div>
      <DetailHeader />
      <div className="mt-[10px] px-5 py-4">
        <div className="z-1 fixed left-0 right-0 w-full bg-white px-5 py-4">
          <div className="text-color-neutral-60 mb-2 text-right text-xs">
            {modalPage + 1} / 4
          </div>
          <Progress
            value={((modalPage + 1) / 4) * 100}
            className="text-color-primary-normal"
          />
        </div>
        <div className="mt-[80px]">
          {modalPage === 0 && <StoreInfoForm />}
          {modalPage === 1 && <TimeSlotForm />}
          {modalPage === 2 && <LocationForm />}
          {modalPage === 3 && <MenuForm />}
        </div>
      </div>
    </div>
  );
}
