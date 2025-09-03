"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DetailHeader } from "../../components/DetailHeader";
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
