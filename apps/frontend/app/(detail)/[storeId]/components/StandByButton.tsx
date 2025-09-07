"use client";
import { FormSection } from "@/app/components/FormSection";
import { ReservationResponse } from "@/app/type";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { safeFetcher } from "@/lib/utils";
import minusIcon from "@/public/icons/icon_minus.svg";
import plusIcon from "@/public/icons/icon_plus.svg";
import { valibotResolver } from "@hookform/resolvers/valibot";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
} from "react-hook-form";
import { toast } from "sonner";
import { createSchema } from "./_libs/schema";

function StandByButtonForm({ children }: { children: React.ReactNode }) {
  interface CreateStandByInput {
    headcount: number;
    storeId: number;
    phoneMiddle: string;
    phoneLast: string;
  }
  const methods = useForm<CreateStandByInput>({
    resolver: valibotResolver(createSchema),
    mode: "onChange",
    defaultValues: {
      headcount: 0,
      storeId: 0,
      phoneMiddle: "",
      phoneLast: "",
    },
  });

  const onSubmit: SubmitHandler<CreateStandByInput> = async data => {
    try {
      const standByData = {
        headcount: data.headcount,
        storeId: data.storeId,
        phone: `010${data.phoneMiddle}${data.phoneLast}`,
      };

      console.log(standByData);

      const response = await safeFetcher.post("reservation/walkin", {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(standByData),
      });
      const reservationResponse: ReservationResponse = await response.json();
      toast.success("현장 대기 생성에 성공했습니다.");
      const reservationNum = reservationResponse.reservationNum; // 예: 응답에서 예약 ID 추출
      //   router.push(`./reservation/success?reservationNum=${reservationNum}`);
    } catch (error) {
      console.error("Error creating stand by:", error);
      toast.error("현장 대기 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}

export function StandByButton() {
  const storeId = useParams().storeId;
  const [count, setCount] = useState(0);

  function StandByInput() {
    const { register, setValue } = useFormContext();
    setValue("storeId", Number(storeId));

    return (
      <>
        <FormSection title="본인 전화번호">
          <div className="flex gap-1">
            <Input type="number" placeholder="010" disabled />
            <Input type="tel" maxLength={4} {...register("phoneMiddle")} />
            <Input type="tel" maxLength={4} {...register("phoneLast")} />
          </div>
        </FormSection>
        <FormSection title="총 인원" isRow>
          <div className="flex items-center gap-5">
            <Button variant="counter" className="h-[38px] w-[38px] p-[7px]">
              <Image
                src={minusIcon}
                alt="Remove"
                onClick={() => {
                  setCount(prev => Math.max(prev - 1, 0));
                  setValue("headcount", count - 1, { shouldValidate: true });
                }}
              />
            </Button>
            <span className="text-base font-medium">{count}</span>
            <Button variant="counter" className="h-[38px] w-[38px] p-[7px]">
              <Image
                src={plusIcon}
                alt="Add"
                onClick={() => {
                  setCount(prev => prev + 1);
                  setValue("headcount", count + 1, { shouldValidate: true });
                }}
              />
            </Button>
          </div>
        </FormSection>
      </>
    );
  }

  function SubmitButton() {
    const {
      formState: { isValid },
    } = useFormContext();
    return (
      <Button className="w-full" type="submit" disabled={!isValid}>
        현장 대기 신청하기
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant={"outline"}>
          현장 대기
        </Button>
      </DialogTrigger>
      <DialogContent className="py-6">
        <DialogTitle>현장 대기 신청</DialogTitle>

        <StandByButtonForm>
          <div className="flex h-full flex-col gap-4">
            <StandByInput />
            <SubmitButton />
          </div>
        </StandByButtonForm>
      </DialogContent>
    </Dialog>
  );
}
