import Location from "@/icons/icon_location.svg";
import Clock from "@/icons/orangeClock.svg";
import Money from "@/icons/orangeMoney.svg";
import Image from "next/image";

export default function BarCard() {
  return (
    <div className="w-[335px] h-[250px] rounded-[6px]">
      <div></div>

      <div>
        <div></div>
        <div
          className="text-[#FF5940]
           text-xs
           font-normal
           leading-[140%]
           tracking-[-0.36px]"
        >
          SKKUDING
        </div>
        <div
          className="text-color-common-0
           text-base
           font-medium
           leading-[140%]
           tracking-[-0.48px]
           mb-3"
        >
          모태솔로지만 연애는 하고싶어
        </div>
        <div className="flex flex-col p-2 justify-center items-start gap-1 self-stretch rounded-[6px] bg-color-neutral-99 w-[295px] h-[87px]">
          <div className="flex flex-row  w-full items-center">
            <Image
              src={Location}
              alt="위치"
              width={16}
              height={16}
              className="mr-1"
            />
            <p
              className="text-color-neutral-40
                font-sans
                text-sm
                font-normal
                leading-[150%]
                tracking-[-0.56px]
                  "
            >
              위치
            </p>
            <p
              className="text-color-neutral-20
                font-sans
                text-sm
                font-normal
                leading-[150%]
                tracking-[-0.56px]
                ml-auto"
            >
              경영관 테라스
            </p>
          </div>
          <div className="flex flex-row  w-full items-center">
            <Image
              src={Clock}
              alt="시간"
              width={12}
              height={12}
              className="mr-1 ml-[2px]"
            />
            <p
              className="text-color-neutral-40
                font-sans
                text-sm
                font-normal
                leading-[150%]
                tracking-[-0.56px]
                  "
            >
              운영 시간
            </p>
            <p
              className="text-color-neutral-20
                font-sans
                text-sm
                font-normal
                leading-[150%]
                tracking-[-0.56px]
                ml-auto"
            >
              14:00 ~ 22:00
            </p>
          </div>
          <div className="flex flex-row  w-full items-center">
            <Image
              src={Money}
              alt="돈"
              width={16}
              height={16}
              className="mr-1"
            />
            <p
              className="text-color-neutral-40
                font-sans
                text-sm
                font-normal
                leading-[150%]
                tracking-[-0.56px]
                  "
            >
              입장료
            </p>
            <p
              className="text-color-neutral-20
                font-sans
                text-sm
                font-normal
                leading-[150%]
                tracking-[-0.56px]
                ml-auto"
            >
              인당 20,000 원
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
