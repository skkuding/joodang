"use client";
import { DetailHeader } from "@/app/components/DetailHeader";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <DetailHeader />
        <div className="pt-[18px]">{children}</div>
      </div>
    </QueryClientProvider>
  );
}
