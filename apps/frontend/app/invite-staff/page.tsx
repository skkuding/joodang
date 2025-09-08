"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import InviteStaffContent from "./InviteStaffContent";
export default function Page() {
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get("coinviteCodede");

  useEffect(() => {
    if (inviteCode) {
      localStorage.setItem("inviteCode", inviteCode);
    }
  }, [inviteCode]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InviteStaffContent />
    </Suspense>
  );
}
