"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      position="top-center"
      duration={3000}
      visibleToasts={1}
      toastOptions={{
        style: {
          background: "rgba(0, 0, 0, 0.8)",
          color: "white",
          border: "none",
          borderRadius: "1000px",
          padding: "10px 20px",
          width: "fit-content",
          margin: "0 auto",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
