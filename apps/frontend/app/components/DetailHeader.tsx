"use client";
import { useCreateStoreStore } from "@/app/stores/createStore";
import arrowIcon from "@/public/icons/icon_arrow.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

export function DetailHeader() {
  const router = useRouter();
  const { modalPage, backModal } = useCreateStoreStore(state => state);

  const handleBack = () => {
    if (window.location.pathname.includes("/create-store") && modalPage > 0) {
      backModal();
      return;
    }

    const ref = document.referrer;
    const sameOrigin = ref.startsWith(window.location.origin);

    if (sameOrigin) {
      router.back();
    } else {
      router.push("/");
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
