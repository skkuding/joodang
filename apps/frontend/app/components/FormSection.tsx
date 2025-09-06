export function FormSection({
  title,
  description,
  children,
  isRow = false,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  isRow?: boolean;
}) {
  return (
    <div className={`flex ${isRow ? "justify-between" : "flex-col"} gap-3`}>
      <div>
        <div className="flex items-center gap-2 text-base font-medium">
          <div className="bg-primary-normal h-1.5 w-1.5 rounded-full" />
          {title}
        </div>
        {description && (
          <span className="text-color-neutral-50 ml-3 text-xs font-normal">
            {description}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
