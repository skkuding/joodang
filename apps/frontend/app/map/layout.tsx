import { Toaster } from "../../components/ui/sonner";
export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div>{children}</div>
      <Toaster />
    </div>
  );
}
