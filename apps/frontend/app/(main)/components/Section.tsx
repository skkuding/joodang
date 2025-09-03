import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";

interface SectionProps {
  title: string;
  route: string;
  children: React.ReactNode;
}
export function Section({ title, route, children }: SectionProps) {
  return (
    <div className="p-5">
      <div className="flex justify-between">
        <span className="text-xl font-medium">{title}</span>
        <Link href={route} className="flex items-center gap-[2px]">
          <span className="text-color-neutral-40 text-xs font-normal">
            더보기
          </span>
          <IoIosArrowForward className="text-color-neutral-40 h-[13px] w-[13px]" />
        </Link>
      </div>
      {children}
    </div>
  );
}
