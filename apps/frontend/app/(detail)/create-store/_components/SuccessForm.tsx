import Link from "next/link";
import { useCreateStoreStore } from "@/app/stores/createStore";
import Image from "next/image";
import checkIcon from "@/public/icons/icon_check_round.svg";

export default function SuccessForm() {
  const { createdStoreId, editingStoreId } = useCreateStoreStore(
    state => state
  );
  const currentStoreId = createdStoreId ?? editingStoreId;
  return (
    <div>
      <div className="fixed left-0 right-0 top-0 z-20 flex h-20 w-full bg-white" />
      <div className="flex min-h-[calc(100dvh-22rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-1.5">
          <Image src={checkIcon} alt="check" width={50} height={50} />
          <div className="text-2xl font-medium">주점 등록이 완료되었어요!</div>
          <div className="text-color-neutral-30 text-sm">
            등록한 주점을 확인해볼까요?
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 z-20 flex h-40 w-full flex-col gap-2.5 bg-white px-5 py-4 text-center">
        <Link
          href={currentStoreId ? `/${currentStoreId}` : "/"}
          className="bg-primary-normal rounded-lg py-[14px] font-medium text-white"
        >
          등록한 주점 확인하기
        </Link>
        <Link
          href="/"
          className="border-primary-normal text-primary-normal rounded-lg border py-[14px] font-medium"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
