"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      className="!bottom-3 !left-0 !right-0 !flex !w-screen !transform-none !justify-center"
      theme={theme as ToasterProps["theme"]}
      position="bottom-center"
      duration={3000}
      visibleToasts={1}
      offset={80}
      toastOptions={{
        classNames: {
          toast: "!mx-auto",
        },
        style: {
          background: "rgba(0, 0, 0, 0.8)",
          color: "white",
          border: "none",
          borderRadius: "1000px",
          padding: "10px 20px",
          maxWidth: "min(92vw, 420px)",
          width: "max-content",
          height: "auto",
          minHeight: "auto",
        } as React.CSSProperties,
      }}
      {...props}
    />
  );
};

export { Toaster };
