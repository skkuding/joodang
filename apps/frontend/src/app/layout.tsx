import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { IoIosArrowDown } from "react-icons/io";
import "./globals.css";
import { Footer } from './components/Footer'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  title: "주당 Joodang",
  description: "주당 Joodang"
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <header>
          <div className="fixed left-0 right-0 top-0 w-full px-5 flex bg-white h-[68px] items-end ">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex gap-1 items-center">
                <span className="text-xl font-semibold">성균관대학교</span>
                <IoIosArrowDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>성균관대학교</DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <Script
          type="text/javascript"
          src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_ID}&submodules=geocoder`}
        />
        <main
          className={`${geistSans.variable} ${geistMono.variable} antialiased pt-[48px] pb-20`}
        >
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
