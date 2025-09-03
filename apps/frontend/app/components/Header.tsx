"use client";
import { IoIosArrowDown } from "react-icons/io";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

export function Header() {
  return (
    <div className="fixed left-0 right-0 top-0 w-full px-5 flex bg-white h-[68px] items-center ">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex gap-1 items-center">
          <span className="text-xl font-semibold">성균관대학교</span>
          <IoIosArrowDown className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>성균관대학교</DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
