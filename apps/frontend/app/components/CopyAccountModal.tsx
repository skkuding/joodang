"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BankCodes } from "@/constant";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { Store } from "../type";

interface CopyAccountModalProps {
  store: Store;
}

export default function CopyAccountModal({ store }: CopyAccountModalProps) {
  const handleCopyAccount = async () => {
    toast.dismiss();
    try {
      await navigator.clipboard.writeText(store.accountNumber);
      toast.success("계좌가 복사되었습니다", {
        id: "copy-toast",
      });
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <span className="text-error text-sm font-normal underline">
          자세히 보기
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle className="hidden" />
        <div className="text-md flex h-[192px] flex-col justify-between text-center font-normal">
          <div className="mt-3 flex h-full flex-col justify-center gap-1">
            <p>
              {BankCodes[store.bankCode]} {store.accountNumber}
            </p>
            <p>예금주 {store.accountHolder}</p>
          </div>
          <Button className="mb-1 w-full" onClick={handleCopyAccount}>
            복사하기
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
