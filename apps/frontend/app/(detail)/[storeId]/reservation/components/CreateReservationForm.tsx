import { safeFetcher } from "@/lib/utils";
import { valibotResolver } from "@hookform/resolvers/valibot";
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

      await safeFetcher.post("reservation", {
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reservationData),
      });
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
