interface FloatingBottomBarProps {
  children: React.ReactNode;
}
export function FloatingBottomBar({ children }: FloatingBottomBarProps) {
  return (
    <div className="pb-15 fixed bottom-0 left-0 right-0 bg-white p-5">
      {children}
    </div>
  );
}
