import { FormSection } from "@/app/components/FormSection";
import { RoleEnum, User } from "@/app/type";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { safeFetcher } from "@/lib/utils";
import successIcon from "@/public/icons/icon_orange_beers.svg";
import { valibotResolver } from "@hookform/resolvers/valibot";
import Image from "next/image";
import { useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
} from "react-hook-form";
import { toast } from "sonner";
import { createSchema } from "./_libs/schema";

function RequestRoleForm({
  children,
  onSuccess,
}: {
  children: React.ReactNode;
  onSuccess?: (isDone: boolean) => void;
}) {
  interface RequestRoleInput {
    phoneMiddle: string;
    phoneLast: string;
    organization: string;
  }
  const methods = useForm<RequestRoleInput>({
    resolver: valibotResolver(createSchema),
    mode: "onChange",
    defaultValues: {
      organization: "",
      phoneMiddle: "",
      phoneLast: "",
    },
  });

  const onSubmit: SubmitHandler<RequestRoleInput> = async data => {
    try {
      const requestRoleData = {
        organizer: data.organization,
        phone: `010${data.phoneMiddle}${data.phoneLast}`,
      };

      const response = await safeFetcher
        .post("user/owner-application", {
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestRoleData),
        })
        .json();
      console.log(response);
      onSuccess?.(true);
    } catch (error) {
      toast.error("현장 대기 생성에 실패했습니다. 다시 시도해주세요." + error);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}

function RequestRoleInput() {
  const { register } = useFormContext();
  return (
    <div className="flex flex-col gap-5 py-6">
      <FormSection
        title="본인 전화번호"
        description="주점 운영자는 필수적으로 입력해야 해요."
      >
        <div className="flex gap-1">
          <Input type="number" placeholder="010" disabled />
          <Input type="tel" maxLength={4} {...register("phoneMiddle")} />
          <Input type="tel" maxLength={4} {...register("phoneLast")} />
        </div>
      </FormSection>
      <FormSection title="운영 단체명">
        <Input type="text" {...register("organization")} />
      </FormSection>
    </div>
  );
}

function SubmitButton() {
  const {
    formState: { isValid },
  } = useFormContext();
  return (
    <Button className="w-full" type="submit" disabled={!isValid}>
      계정 변경 신청하기
    </Button>
  );
}

function RequestedInfo() {
  return (
    <div className="flex flex-col items-center gap-4 px-7 py-6">
      <Image src={successIcon} alt="Success" />
      <p className="text-2xl font-semibold">계정 변경이 신청되었어요!</p>
      <span className="text-color-neutral-30 text-sm font-normal">
        주점 운영자 계정으로 전환되면 알림을 보내드릴게요. 유저 계정 변경을
        원하신다면 마이페이지에서 가능해요
      </span>
    </div>
  );
}

function ConfirmButton({ onClose }: { onClose: () => void }) {
  return (
    <Button className="w-full" onClick={onClose}>
      확인했어요
    </Button>
  );
}

interface RequestRoleButtonProps {
  user: User;
}

export function RequestRoleButton({ user }: RequestRoleButtonProps) {
  const [isDone, setIsDone] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={user.role === RoleEnum.OWNER} className="mt-[30px]">
          주점 운영자 계정 변경 신청
        </Button>
      </DialogTrigger>
      <DialogContent className="py-6">
        {!isDone ? (
          <>
            <DialogTitle>주점 운영자 계정으로 변경</DialogTitle>
            <RequestRoleForm onSuccess={() => setIsDone(true)}>
              <RequestRoleInput />
              <SubmitButton />
            </RequestRoleForm>
          </>
        ) : (
          <>
            <DialogTitle className="hidden" />
            <RequestedInfo />
            <ConfirmButton onClose={() => setOpen(false)} />
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
