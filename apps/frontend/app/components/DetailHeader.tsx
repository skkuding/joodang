"use client";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

export function DetailHeader() {
  const router = useRouter();
  return (
    <div className="z-1 fixed left-0 right-0 top-0 flex h-[78px] w-full justify-between bg-white px-5 pt-[50px]">
      <IoIosArrowBack
        className="h-6 w-6"
        onClick={() => {
          router.back();
        }}
      />
    </div>
  );
}
