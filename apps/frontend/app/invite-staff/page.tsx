"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import InviteStaffContent from "./InviteStaffContent";

function InviteCodeSaver() {
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get("inviteCode");

  useEffect(() => {
    if (inviteCode) {
      localStorage.setItem("inviteCode", inviteCode);
    }
  }, [inviteCode]);

  return null;
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InviteCodeSaver />
      <InviteStaffContent />
    </Suspense>
  );
}
