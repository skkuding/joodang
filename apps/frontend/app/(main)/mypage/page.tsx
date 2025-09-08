"use client";

import { AuthSheet } from "@/app/components/AuthSheet";
import { User } from "@/app/type";
import { Button } from "@/components/ui/button";
import { safeFetcher } from "@/lib/utils";
import arrowIcon from "@/public/icons/icon_arrow.svg";
import defaultProfileIcon from "@/public/icons/icon_default_profile.svg";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Page() {
  const [user, setUser] = useState<User | null>(null);
  const [openAuthSheet, setOpenAuthSheet] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [phone, setPhone] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user: User = await safeFetcher.get("user/me").json();
        setUser(user);
      } catch {}

      fetchUser();
    };
  }, []);

  const handleAuth = () => {
    if (user) {
      safeFetcher.post("auth/logout").then(() => {
        setUser(null);
        window.location.reload();
      });
    } else {
      setOpenAuthSheet(true);
    }
  };

  const handleApplyForOwner = async () => {
    if (!phone || !organizer) {
      alert("전화번호와 단체명을 모두 입력해주세요.");
      return;
    }

    if (phone.length < 8 || phone.length > 15) {
      alert("전화번호는 8-15자리여야 합니다.");
      return;
    }

    try {
      setIsApplying(true);
      await safeFetcher.post("user/owner-application", {
        json: {
          phone,
          organizer,
        },
      });
      alert("관리자 권한 요청이 완료되었습니다. 검토 후 연락드리겠습니다.");
      setShowApplyForm(false);
      setPhone("");
      setOrganizer("");
    } catch (error) {
      console.error("관리자 권한 요청 실패:", error);
      alert("관리자 권한 요청에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="flex flex-col bg-amber-100">
      <AuthSheet
        open={openAuthSheet}
        onOpenChange={setOpenAuthSheet}
        closeToHistory={false}
      />
      <div className="flex gap-3 bg-amber-200 p-5">
        <Image src={defaultProfileIcon} alt="Default Profile" />
        <div className="flex w-full flex-col">
          <div className="flex justify-between">
            <span className="text-xl font-semibold">
              {user ? user.name : "로그인하세요"}
            </span>
            <div className="flex items-center gap-[2px]">
              <Button variant={"ghost"} className="h-3" onClick={handleAuth}>
                <span className="text-color-neutral-40 text-xs font-normal">
                  {user ? "로그아웃" : "로그인"}
                </span>
                <Image src={arrowIcon} alt="Arrow Icon" width={15} />
              </Button>
            </div>
          </div>
          <span className="text-color-neutral-60 text-sm font-normal">
            비회원 상태
          </span>
        </div>
      </div>

      {/* {userRole === "USER" && (
        <div className="mx-auto max-w-md space-y-4">
          <div className="text-center">
            <h2 className="mb-2 text-lg font-semibold">관리자 권한 요청</h2>
            <p className="mb-4 text-sm text-gray-600">
              주점을 등록하려면 관리자 권한이 필요합니다.
            </p>
          </div>

          {!showApplyForm ? (
            <Button onClick={() => setShowApplyForm(true)} className="w-full">
              관리자 권한 요청하기
            </Button>
          ) : (
            <div className="space-y-4 rounded-lg border p-4">
              <div>
                <Label htmlFor="phone">전화번호</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="010-1234-5678"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="organizer">단체명</Label>
                <Input
                  id="organizer"
                  type="text"
                  value={organizer}
                  onChange={e => setOrganizer(e.target.value)}
                  placeholder="단체명을 입력하세요"
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleApplyForOwner}
                  disabled={isApplying}
                  className="flex-1"
                >
                  {isApplying ? "요청 중..." : "요청하기"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowApplyForm(false);
                    setPhone("");
                    setOrganizer("");
                  }}
                  className="flex-1"
                >
                  취소
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {(userRole === "OWNER" || userRole === "ADMIN") && (
        <div className="text-center">
          <Button
            onClick={() => (window.location.href = "/create-store")}
            className="w-full max-w-md"
          >
            주점 등록하기
          </Button>
        </div>
      )} */}
    </div>
  );
}
