import { Button } from "@/ui/button";
import Link from "next/link";

export function ReservationConfirmButton() {
  return (
    <Link href={"/reservation-check-page"} className="w-full">
      <Button className="w-full">확인했어요</Button>
    </Link>
  );
}
