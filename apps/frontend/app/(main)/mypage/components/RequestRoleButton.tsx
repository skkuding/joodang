import { RoleEnum, User } from "@/app/type";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface RequestRoleButtonProps {
  user: User;
}

export function RequestRoleButton({ user }: RequestRoleButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={user.role !== RoleEnum.OWNER} className="mt-[30px]">
          주점 운영자 계정 변경 신청
        </Button>
      </DialogTrigger>
      <DialogContent className="py-6"></DialogContent>
    </Dialog>
  );
}
