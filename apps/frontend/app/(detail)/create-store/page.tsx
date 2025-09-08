"use client";

import { useCreateStoreStore } from "@/app/stores/createStore";
import { Progress } from "@/components/ui/progress";
import { useEffect, useRef } from "react";
import LocationForm from "./_components/LocationForm";
import MenuForm from "./_components/MenuForm";
import StoreInfoForm from "./_components/StoreInfoForm";
import TimeSlotForm from "./_components/TimeSlotForm";
import SuccessForm from "./_components/SuccessForm";

export default function Page() {
  const { modalPage, setModalPage } = useCreateStoreStore(state => state);

  const modalPageRef = useRef(modalPage);
  useEffect(() => {
    modalPageRef.current = modalPage;
  }, [modalPage]);

  // 뒤로가기: 단계가 있으면 한 단계 뒤로만 이동
  useEffect(() => {
    const handlePopState = () => {
      if (modalPageRef.current > 0) {
        setModalPage(modalPageRef.current - 1);
      }
    };
    window.addEventListener("popstate", handlePopState);
    // 초기 진입 시 기준 스택 1개 쌓기
    window.history.pushState(null, "", window.location.href);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [setModalPage]);

  // 단계가 변경될 때마다 히스토리에 스택을 추가하여 브라우저 뒤로가기로 단계 이동 가능
  useEffect(() => {
    if (modalPage > 0 && modalPage < 4) {
      window.history.pushState(null, "", window.location.href);
    }
  }, [modalPage]);
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
