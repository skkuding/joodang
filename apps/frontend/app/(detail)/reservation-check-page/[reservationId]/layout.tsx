import { DetailHeader } from "@/app/components/DetailHeader";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <DetailHeader />
      <div>{children}</div>
      <Toaster />
    </div>
  );
}
