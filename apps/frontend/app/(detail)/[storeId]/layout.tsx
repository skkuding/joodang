import { Toaster } from "../../../components/ui/sonner";
import { DetailHeader } from "../../components/DetailHeader";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <DetailHeader />
      <div className="pt-10">{children}</div>
      <Toaster />
    </div>
  );
}
