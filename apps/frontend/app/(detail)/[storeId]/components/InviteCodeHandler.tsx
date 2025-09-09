"use client";

import { safeFetcher } from "@/lib/utils";
import { useEffect } from "react";
import { toast } from "sonner";

interface InviteCodeHandlerProps {
  inviteCode: string;
}

export function InviteCodeHandler({ inviteCode }: InviteCodeHandlerProps) {
  useEffect(() => {
    const handleInviteCode = async () => {
      try {
        const invitationData = {
          code: inviteCode,
        };
        await safeFetcher.post("store/staff/invitation/accept", {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...invitationData }),
        });
        toast.success("스탭 초대가 완료되었어요!");
      } catch {
        toast.error("스탭 초대에 실패했어요. 다시 시도해주세요.");
      }
    };

    handleInviteCode();
  }, [inviteCode]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다
}
