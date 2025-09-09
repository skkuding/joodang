import CheckIcon from "@/public/icons/icon_check_round.svg";
import Image from "next/image";
import Link from "next/link";

export default function CancelSucessPage() {
  return (
    <div className="bg-color-common-100 pb-15 z-3 fixed left-0 right-0 top-0 flex min-h-svh flex-col items-center">
      <section className="mt-[7px] flex flex-1 flex-col items-center justify-center">
        <Image src={CheckIcon} alt="caution" width={48} height={48} />
        <p className="text-color-common-0 text-2xl font-medium leading-loose text-black">
          예약이 취소되었습니다
        </p>
        <p>주당을 이용해주셔서 감사합니다</p>
      </section>

      <section className="mt-auto flex w-full flex-col space-y-[10px] px-5">
        <Link href="/find">
          <button className="text-color-common-100 bg-primary-normal inline-flex w-full items-center justify-center rounded-md px-4 py-3.5 text-base font-medium leading-snug">
            다른 주점 둘러보기
          </button>
        </Link>
        <Link href="/">
          <button className="bg-color-common-100 border-primary-normal inline-flex w-full items-center justify-center rounded-md border px-4 py-3.5 text-base font-medium leading-snug text-[#FF5940]">
            홈으로 돌아가기
          </button>
        </Link>
      </section>
    </div>
  );
}
