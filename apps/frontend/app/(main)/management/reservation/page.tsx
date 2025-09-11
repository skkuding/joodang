import { Suspense } from "react";
import ReservationManagementPageInner from "./ReservationManagementPageInner";

export default function ReservationManagementPage() {
  return (
    <Suspense fallback={null}>
      <ReservationManagementPageInner />
    </Suspense>
  );
}
