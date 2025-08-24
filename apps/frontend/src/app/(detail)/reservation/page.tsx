export default async function Page({
  params,
}: {
  params: { storeId: string };
}) {
  return <div>Reservation Page for Store ID: {params.storeId}</div>;
}
