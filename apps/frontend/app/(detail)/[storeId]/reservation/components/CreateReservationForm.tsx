"use client";
import { safeFetcher } from "@/lib/utils";
import { valibotResolver } from "@hookform/resolvers/valibot";

import { ReservationResponse } from "@/app/type";
import { HTTPError } from "ky";
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

      sessionStorage.setItem(
        "reservationData",
        JSON.stringify(reservationResponse)
      );
      router.push("./reservation/success");
    } catch (error) {
      console.error("Error creating reservation:", error);
      if (error instanceof HTTPError) {
        try {
          const errorData = await error.response.json();
          console.log("Error data:", errorData);

          if (error.response.status === 409) {
            toast.error("해당 시간대에 예약이 존재합니다.");
          } else if (errorData.message) {
            toast.error(errorData.message);
          } else {
            toast.error("예약 생성에 실패했습니다. 다시 시도해주세요1.");
          }
        } catch (parseError) {
          console.error("Error parsing response:", parseError);
          toast.error("예약 생성에 실패했습니다. 다시 시도해주세요2.");
        }
      } else {
        console.error("Non-HTTP error:", error);
        toast.error("예약 생성에 실패했습니다. 다시 시도해주세요.3");
      }
    }
  };
  return (
    <form onSubmit={methods.handleSubmit(onSubmit)}>
      <FormProvider {...methods}>{children}</FormProvider>
    </form>
  );
}
