"use client";

import { WithChildren } from "@/lib/types";
import { useGetWebSettings } from "../modules/web-settings/api";
import { Navbar } from "./navbar";
import { cn } from "@/lib/utils";
import { Footer } from "./footer";

interface AuthenticationLayoutProps extends WithChildren {
  className?: string;
}

export function AuthenticationLayout({
  children,
  className,
}: AuthenticationLayoutProps) {
  const { data } = useGetWebSettings();
  const websettinggsData = data?.data;
  return (
    <>
      {websettinggsData && (
        <>
          <Navbar data={websettinggsData} />
          <main
            className={cn(
              "relative max-w-7xl flex flex-col space-y-10 w-full items-center  container",
              className
            )}
          >
            {children}
          </main>
          <Footer data={websettinggsData} />
        </>
      )}
    </>
  );
}
