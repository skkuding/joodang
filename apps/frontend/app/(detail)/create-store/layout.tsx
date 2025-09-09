export default function CreateStoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      {children}
      <div className="h-20" />
    </div>
  );
}
