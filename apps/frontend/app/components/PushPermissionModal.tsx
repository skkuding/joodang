"use client";
import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import CautionIcon from "@/public/icons/icon_caution.svg";
import Image from "next/image";

// 이벤트 타입 -> 메시지 매핑
const messages: Record<string, { title: string; description: string; showFaqButton?: boolean }> = {
  "push:unsupported": {
    title: "푸시 알림 미지원",
    description: "이 브라우저에선 푸시 알림을 사용할 수 없어요.\n\nFAQ를 참고해 PWA 설치 후 이용해주세요.",
    showFaqButton: true,
  },
  "push:denied": {
    title: "알림 권한 차단됨",
    description: "브라우저에서 알림 권한이 차단됐어요.\n\n설정에서 권한을 허용한 뒤 다시 시도해주세요.",
    showFaqButton: true,
  },
  "push:error": {
    title: "구독 실패",
    description: "푸시 구독 중 오류가 발생했어요.\n\n잠시 후 다시 시도해주세요.",
  },
  "push:already": {
    title: "이미 구독됨",
    description: "이미 푸시 알림이 활성화되어 있습니다.",
  },
  "push:subscribed": {
    title: "구독 완료",
    description: "푸시 알림이 활성화되었어요!",
  },
};

export function PushPermissionModal() {
  const [open, setOpen] = useState(false);
  const [eventKey, setEventKey] = useState<string | null>(null);
  const router = useRouter();

  const handleEvent = useCallback((key: string) => {
    setEventKey(key);
    setOpen(true);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      handleEvent((e as CustomEvent).type);
    };
    const keys = Object.keys(messages);
    keys.forEach((k) => window.addEventListener(k, handler));
    return () => {
      keys.forEach((k) => window.removeEventListener(k, handler));
    };
  }, [handleEvent]);

  const data = eventKey ? messages[eventKey] : null;

  const handleFaqClick = () => {
    router.push("/faq");
    setOpen(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="py-6">
        <div className="flex flex-col items-center justify-center">
          <Image
            src={CautionIcon}
            alt="caution"
            width={48}
            height={48}
            className="mb-4"
          />
          <DialogTitle className="text-color-common-0 mb-4 text-xl font-medium leading-7 text-center">
            {data?.title}
          </DialogTitle>
          <div className="text-color-neutral-40 mb-6 flex flex-col items-center text-sm font-normal leading-tight text-center">
            {data?.description.split('\n').map((line, idx) => (
              <p key={idx}>{line}</p>
            ))}
          </div>
          
          {data?.showFaqButton ? (
            <div className="flex w-full gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                닫기
              </Button>
              <Button
                className="flex-1 bg-[#FF5940] hover:bg-[#FF5940]/90"
                onClick={handleFaqClick}
              >
                FAQ 보기
              </Button>
            </div>
          ) : (
            <Button
              className="w-full bg-[#FF5940] hover:bg-[#FF5940]/90"
              onClick={handleClose}
            >
              확인
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
