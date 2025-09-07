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
import { useState } from "react";
import {
  FormProvider,
  SubmitHandler,
  useForm,
  useFormContext,
} from "react-hook-form";
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

      const response = await safeFetcher.post("reservation", {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(standByData),
      });
      const reservationResponse: ReservationResponse = await response.json();

      const reservationNum = reservationResponse.reservationNum; // 예: 응답에서 예약 ID 추출
      //   router.push(`./reservation/success?reservationNum=${reservationNum}`);
    } catch (error) {
      console.error("Error creating reservation:", error);
      //   toast.error("예약 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>{children}</form>
    </FormProvider>
  );
}

export function StandByButton() {
  const [count, setCount] = useState(0);
  const { register, setValue } = useFormContext();
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant={"outline"}>
          현장 대기
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>현장 대기 신청</DialogTitle>
        <StandByButtonForm>
          <FormSection title="총 인원" isRow>
            <div className="flex items-center gap-5">
              <Button variant="outline" className="h-[38px] w-[38px] p-[7px]">
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
              <Button variant="outline" className="h-[38px] w-[38px] p-[7px]">
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

          <FormSection
            title="본인 전화번호"
            description="주점에서 연락이 갈 수 있어요! 연락 가능한 번호를 작성해주세요"
          >
            <div className="flex gap-1">
              <Input type="number" placeholder="010" disabled />
              <Input type="tel" maxLength={4} {...register("phoneMiddle")} />
              <Input type="tel" maxLength={4} {...register("phoneLast")} />
            </div>
          </FormSection>
          <Button type="submit" className="w-full">
            현장 대기 신청하기
          </Button>
        </StandByButtonForm>
      </DialogContent>
    </Dialog>
  );
}
