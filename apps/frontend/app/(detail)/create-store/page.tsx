"use client";

import { useCreateStoreStore } from "@/app/stores/createStore";
import { Progress } from "@/components/ui/progress";
import { useEffect } from "react";
import LocationForm from "./_components/LocationForm";
import MenuForm from "./_components/MenuForm";
import StoreInfoForm from "./_components/StoreInfoForm";
import TimeSlotForm from "./_components/TimeSlotForm";
import SuccessForm from "./_components/SuccessForm";

export default function Page() {
  const { modalPage, setModalPage } = useCreateStoreStore(state => state);

  useEffect(() => {
    const handlePopState = () => {
      if (modalPage > 0 && modalPage < 4) {
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
    <div className="px-5">
      {modalPage < 4 && (
        <div className="bg-white py-2">
          <div className="text-color-neutral-60 mb-2 text-right text-xs">
            {modalPage + 1} / 4
          </div>
          <Progress
            value={((modalPage + 1) / 4) * 100}
            className="text-color-primary-normal"
          />
        </div>
      )}
      <div className="mt-5">
        {modalPage === 0 && <StoreInfoForm />}
        {modalPage === 1 && <TimeSlotForm />}
        {modalPage === 2 && <LocationForm />}
        {modalPage === 3 && <MenuForm />}
        {modalPage === 4 && <SuccessForm />}
      </div>
    </div>
  );
}
