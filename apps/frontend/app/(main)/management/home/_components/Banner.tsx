import { formatDateWithDay } from "@/lib/utils";

export function Banner() {
  return (
    <div className="h-[139px] p-5">
      <div className="bg-color-neutral-20 flex flex-col rounded-md px-5 py-4">
        <span className="text-primary-normal text-xs font-normal">
          {formatDateWithDay(new Date())}
        </span>
        <span className="text-color-common-100 text-lg font-medium">
          성균관대학교 대동제
        </span>
        <span className="text-color-neutral-80 text-sm font-normal">
          오늘은 대동제가 열려요! 함께 축제를 즐겨볼까요?
        </span>
      </div>
    </div>
  );
}
