import { AuthSheet } from "@/app/components/AuthSheet";
// import { safeFetcher } from "@/lib/utils";
import Checkbox from "@/public/icons/orangeCheckbox.svg";
import Image from "next/image";
import ReservationCard from "./components/ReservationCard";

export default function ReservationCheckPage() {
  // const reservations = await safeFetcher("reservation").json();
  // console.log("reservations:", reservations);

  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjIyLCJrYWthb0lkIjoiNDQyMzQxOTQxMyIsImlhdCI6MTc1NzI0NTgzNiwiZXhwIjoxNzU4NDU1NDM2fQ.1UijpIjs9Bo_zmfKd6oPJuMP9QLmpKnCKfx-XWpbLy4";
  // const payload = JSON.parse(atob(token.split(".")[1]));
  // console.log("페이로드: ", payload);
  return (
    <div className="mt-[60px] px-5">
      <AuthSheet />
      <div className="mb-[30px]">
        <Image
          src={Checkbox}
          alt="checkbox"
          width={24}
          height={24}
          className="mb-[2px]"
        />
        <p className="text-color-common-0 font-pretendard mb-2 h-[28px] w-[240px] text-left text-xl font-medium leading-[140%] tracking-[-0.03em]">
          내 예약을 한 눈에 볼 수 있어요
        </p>
        <div className="text-color-neutral-40 font-pretendard text-[14px] font-normal leading-[140%] tracking-[-0.03em]">
          <p>나의 주점 예약 내역을 주당이</p>
          <p>한 눈에 정리해드려요!</p>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="item-center flex flex-col justify-center gap-3">
          <ReservationCard />
          <ReservationCard />
          <ReservationCard />
        </div>
      </div>
    </div>
  );
}
