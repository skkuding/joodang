import Checkbox from "@/icons/orangeCheckbox.svg";
import Image from "next/image";
import ReservationCard from "./components/ReservationCard";

// TODO: 어드민 페이지일 때 탭을 나누어서 '우리 주점을 예약한' 부분의 컴포넌트를 렌더링해야합니다.
export default function ReservationCheckPage() {
  return (
    <div className="px-5">
      <div className="mb-[30px]">
        <Image
          src={Checkbox}
          alt="checkbox"
          width={24}
          height={24}
          className="mb-1"
        />
        <p className="w-[240px] h-[28px] text-color-common-0 font-pretendard font-medium text-xl leading-[140%] tracking-[-0.03em] text-left mb-2">
          내 예약을 한 눈에 볼 수 있어요
        </p>
        <div className="text-color-neutral-40 font-pretendard font-normal text-[14px] leading-[140%] tracking-[-0.03em] ">
          <p>나의 주점 예약 내역을 주당이</p>
          <p>한 눈에 정리해드려요!</p>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col item-center justify-center gap-3">
          <ReservationCard />
          <ReservationCard />
          <ReservationCard />
        </div>
      </div>
    </div>
  );
}
