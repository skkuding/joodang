"use client";

import { Progress } from "@/components/ui/progress";
import { useCreateStoreStore } from "@/app/stores/createStore";
import StoreInfoForm from "./_components/StoreInfoForm";
import { DetailHeader } from "../../../components/DetailHeader";

export default function Page() {
  const {
    modalPage,
    formData,
    setModalPage,
    setFormData,
    nextModal,
    backModal,
  } = useCreateStoreStore(state => state);
  return (
    <div>
      <DetailHeader />
      <div className="mt-[10px] px-5 py-4">
        <div className="z-1 fixed left-0 right-0 w-full bg-white px-5 py-4">
          <div className="text-color-neutral-60 mb-2 text-right text-xs">
            {modalPage + 1} / 3
          </div>
          <Progress
            value={((modalPage + 1) / 4) * 100}
            className="text-color-primary-normal"
          />
        </div>
        <div className="mt-[80px]">
          {modalPage === 0 && <StoreInfoForm />}
          {/* {modalPage === 1 && <TimeSlotForm />}
          {modalPage === 2 && <LocationForm />}
          {modalPage === 3 && <MenuForm />} */}
        </div>
      </div>
    </div>
  );
}
