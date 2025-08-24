import { DetailHeader } from "@/app/components/DetailHeader";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <DetailHeader />
      <div className="pt-[18px]">{children}</div>
    </div>
  );
}
