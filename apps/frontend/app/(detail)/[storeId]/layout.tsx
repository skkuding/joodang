"use client";
import { DetailHeader } from "../../components/DetailHeader";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <DetailHeader />
      <div>{children}</div>
    </div>
  );
}
