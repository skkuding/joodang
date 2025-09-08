"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCreateStoreStore } from "@/app/stores/createStore";
import { Progress } from "@/components/ui/progress";
import StoreInfoForm from "../../create-store/_components/StoreInfoForm";
import TimeSlotForm from "../../create-store/_components/TimeSlotForm";
import LocationForm from "../../create-store/_components/LocationForm";
import MenuForm from "../../create-store/_components/MenuForm";
import SuccessForm from "../../create-store/_components/SuccessForm";
import { getStoreDetail } from "@/lib/api/store";

export default function EditStorePage() {
  const params = useParams<{ storeId: string }>();
  const router = useRouter();
  const { modalPage, setModalPage, initializeForEdit } = useCreateStoreStore(
    state => state
  );

  // 초기 데이터 로딩 (한 번만 실행)
  const initializedRef = useRef(false);
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const storeIdParam = params?.storeId;
    if (!storeIdParam) return;

    const storeId = Number(storeIdParam);
    if (Number.isNaN(storeId)) {
      router.back();
      return;
    }

    (async () => {
      const detail = await getStoreDetail(storeId);
      // 폼 구조에 맞게 초기화 (이미지/메뉴 파일은 비움, 프리뷰는 서버 URL)
      initializeForEdit({
        storeId,
        data: {
          name: detail.name,
          description: detail.description,
          organizer: detail.organizer,
          startTime: detail.startTime,
          endTime: detail.endTime,
          reservationFee: detail.reservationFee,
          college: detail.college,
          icon: detail.icon,
          totalCapacity: detail.totalCapacity,
          contactInfo: detail.contactInfo,
          bankCode: detail.bankCode,
          accountNumber: detail.accountNumber,
          accountHolder: detail.accountHolder,
          location: detail.location,
          latitude: detail.latitude,
          longitude: detail.longitude,
          timeSlots: (detail.timeSlots || []).map(ts => ({
            id: String(ts.id),
            startTime: new Date(ts.startTime),
            endTime: new Date(ts.endTime),
          })),
          representativeImage: null,
          representativeImagePreview: detail.imageUrl || null,
          menuItems: (detail.menus || []).map(m => ({
            id: String(m.id),
            name: m.name,
            price: m.price,
            category:
              m.category === "Bap"
                ? "밥/식사"
                : m.category === "Tang"
                  ? "탕/전골"
                  : m.category === "Tuiguim"
                    ? "튀김류"
                    : m.category === "Fruit"
                      ? "과일"
                      : m.category === "Maroon5"
                        ? "마른안주"
                        : "음료",
            image: null,
            imagePreview: m.imageUrl,
          })),
        },
      });
    })();
  }, []);

  const modalPageRef = useRef(modalPage);
  useEffect(() => {
    modalPageRef.current = modalPage;
  }, [modalPage]);

  // 뒤로가기: 단계 뒤로 이동
  useEffect(() => {
    const handlePopState = () => {
      if (modalPageRef.current > 0) {
        setModalPage(modalPageRef.current - 1);
      }
    };
    window.addEventListener("popstate", handlePopState);
    // 초기 진입 시 기준 스택
    window.history.pushState(null, "", window.location.href);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [setModalPage]);

  // 단계 변경 시 히스토리 스택 추가
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
