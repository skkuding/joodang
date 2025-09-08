import { Separator } from "@/app/(main)/components/Separator";
import { Button } from "@/components/ui/button";
import cautionIcon from "@/public/icons/icon_gray_caution.svg";
import Image from "next/image";

export default function Page() {
  function FAQHeader() {
    return (
      <div className="p-5">
        <p className="text-xl font-medium">FAQ</p>
        <p className="text-color-neutral-40 text-sm font-normal">
          자주 묻는 질문을 모아봤어요
        </p>
        <Button className="mt-4 w-full">
          <a href="mailto:ask@joodang.com" className="w-full">
            1:1 문의 바로가기
          </a>
        </Button>
      </div>
    );
  }

  function FAQList() {
    return (
      <div className="flex flex-col items-center px-5 py-[30px]">
        <Image src={cautionIcon} alt="caution" />
        <p className="text-color-neutral-70 text-sm font-medium">
          등록된 질문이 없어요
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <FAQHeader />
      <Separator />
      <FAQList />
    </div>
  );
}
