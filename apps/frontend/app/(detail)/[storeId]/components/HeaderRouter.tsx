"use client";
import { getCurrentUser, User } from "@/lib/api/user";
import arrowIcon from "@/public/icons/icon_arrow.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export function HeaderRouter() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  const getUser = useCallback(async () => {
    try {
      const userRes = await getCurrentUser();
      setUser(userRes);
    } catch (e) {
      console.log("Get request failed: ", e);
    }
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="z-2 fixed left-0 right-0 top-0 flex h-[78px] w-full justify-between bg-white px-5 pt-[50px]">
      {user ? (
        <Image
          src={arrowIcon}
          alt="Back"
          className="h-6 w-6 rotate-180"
          onClick={() => {
            console.log("user: ", user);
            if (user.role === "USER") {
              router.push("/find");
            } else {
              router.push("/management/store");
            }
          }}
        />
      ) : (
        <Image
          src={arrowIcon}
          alt="Back"
          className="h-6 w-6 rotate-180"
          onClick={() => {
            router.push("/find");
          }}
        />
      )}
    </div>
  );
}
