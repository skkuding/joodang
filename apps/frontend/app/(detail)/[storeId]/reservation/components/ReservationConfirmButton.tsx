import { Button } from "@/ui/button";
import Link from "next/link";
import { requestPermissionAndSubscribe } from "@/lib/push-subscription";

export function ReservationConfirmButton() {
  return (
    <Link href={"/reservation-check-page"} className="w-full">
      <Button className="w-full" onClick={requestPermissionAndSubscribe}>
        확인했어요
      </Button>
    </Link>
  );
}
