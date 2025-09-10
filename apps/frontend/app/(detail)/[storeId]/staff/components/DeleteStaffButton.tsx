import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { safeFetcher } from "@/lib/utils";
import cautionIcon from "@/public/icons/icon_orange_caution.svg";
import { Button } from "@/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteStaffButtonProps {
  storeId: string;
  staffId: number;
  onDelete: () => void; // 삭제 후 호출할 콜백 함수 추가
}

export function DeleteStaffButton({
  storeId,
  staffId,
  onDelete,
}: DeleteStaffButtonProps) {
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await safeFetcher.delete(`store/${storeId}/staff/${staffId}`);
      setOpen(false); // 성공 시 dialog 닫기
      toast.success("스탭이 삭제되었습니다.");
      onDelete(); // 부모 컴포넌트의 fetchStaffs 호출
    } catch {
      toast.error("스탭이 존재하지 않습니다.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-[29px] w-[68px] px-[10px] py-1">삭제하기</Button>
      </DialogTrigger>
      <DialogContent className="py-6">
        <DialogTitle />
        <div className="flex flex-col items-center justify-center">
          <Image src={cautionIcon} alt="Caution Icon" />
          <p className="mt-1 text-xl font-medium">스탭을 삭제하시겠습니까?</p>
          <p className="text-color-neutral-40 mt-[14px] text-[13px] font-normal">
            삭제 시 권한이 모두 사라지며, 권한을 재부여하려면 스탭을 다시
            추가해야 합니다.
          </p>
          <Button className="mt-[30px] w-full" onClick={handleDelete}>
            삭제할게요
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
