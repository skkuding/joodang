"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="flex justify-center"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      position="bottom-center"
      duration={3000}
      visibleToasts={1}
      offset={80}
      toastOptions={{
        style: {
          background: "rgba(0, 0, 0, 0.8)",
          color: "white",
          border: "none",
          borderRadius: "1000px",
          padding: "10px 20px",
          margin: "0 auto",
          width: "fit-content",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
