"use client";
import { useCreateStoreStore } from "@/app/stores/createStore";
import arrowIcon from "@/public/icons/icon_arrow.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function DetailHeader() {
  const router = useRouter();
  const { modalPage, backModal } = useCreateStoreStore(state => state);

  const handleBack = () => {
    // create-store 페이지에서 모달 페이지가 0보다 크면 backModal 사용
    if (window.location.pathname.includes("/create-store") && modalPage > 0) {
      backModal();
    } else {
      // 그 외의 경우에는 브라우저 뒤로가기
      router.back();
    }
  };

  return (
    <div className="z-1 fixed left-0 right-0 top-0 flex h-[78px] w-full justify-between bg-white px-5 pt-[50px]">
      <Image
        src={arrowIcon}
        alt="Back"
        className="h-6 w-6 rotate-180"
        onClick={handleBack}
      />
    </div>
  );
}
