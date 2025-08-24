import IconLocation from "@/icons/icon_location.svg";
import OrangeDot from "@/icons/orange_dot.svg";
import Image from "next/image";
import BarCard from "./components/BarCard";

export default function BarPage() {
  const arr = [1, 2, 3];

  return (
    <div className="mt-[30px]">
      <div>
        <div>
          <Image src={IconLocation} alt="주황위치" width={24} height={24} />
          <div className="text-color-common-0 text-xl font-sans leading-[140%] font-medium tracking-[-0.6px] mt-1">
            우리 학교의 주점을 찾아볼까요?
          </div>
          <div
            className="text-color-neutral-40
            font-sans
            text-[14px]
            font-normal
            leading-[150%]
            tracking-[-0.42px]
            mt-3
            mb-5"
          >
            <p>필터를 설정하면 알맞는 주점을</p>
            <p>주당이 찾아드려요!</p>
          </div>
        </div>
        <div
          className="h-[149px] w-full bg-color-common-100 p-5"
          style={{ boxShadow: "0 0 20px 0 rgba(0, 0, 0, 0.12)" }}
        >
          <div className="mb-[13px]">
            <div className="flex flex-row">
              <Image
                src={OrangeDot}
                alt="주황닷"
                width={6}
                height={6}
                className="mr-2"
              />
              <p
                className="text-color-neutral-30
                font-sans
                text-base
                font-normal
                leading-[150%]
                tracking-[-0.48px]"
              >
                입장료
              </p>
              <p
                className="text-color-neutral-70
                font-sans
                text-base
                not-italic
                font-medium
                leading-[140%]
                tracking-[-0.48px]
                ml-auto"
              >
                10 원
              </p>
            </div>
          </div>
          <button
            className="w-full h-10 bg-[#FF5940] text-color-common-100 rounded-md 
             flex items-center justify-center"
          >
            <p
              className="font-sans
                text-[14px]
                font-medium
                leading-[140%]
                tracking-[-0.42px]"
            >
              필터 설정하기
            </p>
          </button>
        </div>
      </div>
      <div>
        BarList
        {arr.map(() => {
          return (
            <div>
              <BarCard />
            </div>
          );
        })}
      </div>
    </div>
  );
}
