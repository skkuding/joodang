"use client"

import { Progress } from "@/components/ui/progress"
import { useCreateStoreStore } from "@/app/stores/createStore"
import StoreInfoForm from "./_components/StoreInfoForm"

// TODO: 어드민 페이지일 때 탭을 나누어서 '우리 주점을 예약한' 부분의 컴포넌트를 렌더링해야합니다.
export default function Page() {
  const { modalPage, formData, setModalPage, setFormData, nextModal, backModal } = useCreateStoreStore((state) => state);
  return (
    <div className="mt-[48px] px-5">
      <div className="mb-[30px] space-y-6 py-4">
        <Progress value={((modalPage + 1) / 3) * 100} />
        {modalPage === 0 && <StoreInfoForm />}
        {/* {modalPage === 1 && <TimeSlotForm />}
        {modalPage === 2 && <LocationForm />}
        {modalPage === 3 && <MenuForm />} */}
      </div>        
    </div>
  );
}
