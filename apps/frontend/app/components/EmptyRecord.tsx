import cautionIcon from "@/public/icons/icon_gray_caution.svg";
import Image from "next/image";

interface EmptyRecordProps {
  description: string;
}

export function EmptyRecord({ description }: EmptyRecordProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Image src={cautionIcon} alt="caution" />
      <p className="text-color-neutral-70 text-sm font-medium">{description}</p>
    </div>
  );
}
