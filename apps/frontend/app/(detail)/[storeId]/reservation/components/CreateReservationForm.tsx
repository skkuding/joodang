"use client";
import { Menu, ReservationTimeSlot, User } from "@/app/type";
import { safeFetcher } from "@/lib/utils";
import { valibotResolver } from "@hookform/resolvers/valibot";

import { useRouter } from "next/navigation";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { createSchema } from "./_libs/schema";

interface CreateReservationInput {
  headcount: number;
  storeId: number;
  timeSlotId: number;
  phoneMiddle: string;
  phoneLast: string;
}

interface ReservationResponse {
  id: number;
  headcount: number;
  reservationNum: number;
  userId: number;
  phone: string;
  storeId: number;
  timeSlotId: number;
  isconfirmed: boolean | null;
  isDone: boolean;
  menus: Menu[];
  user: User;
  timeSlot: ReservationTimeSlot;
}

export function CreateReservationForm({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const methods = useForm<CreateReservationInput>({
    resolver: valibotResolver(createSchema),
    mode: "onChange",
    defaultValues: {
      headcount: 0,
      storeId: 0,
      timeSlotId: 0,
      phoneMiddle: "",
      phoneLast: "",
    },
  });

  const onSubmit: SubmitHandler<CreateReservationInput> = async data => {
    try {
      const reservationData = {
        headcount: data.headcount,
        storeId: data.storeId,
        timeSlotId: data.timeSlotId,
        phone: `010${data.phoneMiddle}${data.phoneLast}`,
      };
      console.log("Submitting reservation:", reservationData);

      const response = await safeFetcher.post("reservation", {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });
      const reservationResponse: ReservationResponse = await response.json();

      const reservationNum = reservationResponse.reservationNum; // 예: 응답에서 예약 ID 추출
      router.push(`./reservation/success?reservationNum=${reservationNum}`);
    } catch (error) {
      console.error("Error creating reservation:", error);
      toast.error("예약 생성에 실패했습니다. 다시 시도해주세요.");
    }
  };
  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <FormProvider {...methods}>{children}</FormProvider>
    </form>
  );
}
