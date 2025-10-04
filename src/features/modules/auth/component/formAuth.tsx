"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";

interface AuthPageProps {
  children: React.ReactNode;
  title: string;
  description: string;
}
export function AuthPage({ children, description, title }: AuthPageProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  return (
      <main
        className="min-h-screen  flex items-center justify-center bg-cover bg-no-repeat  p-4"
        style={{
          backgroundImage: mounted ? "url('/bg-auth.jpg')" : "none",
        }}
      >
        <Card className="backdrop-blur-md  bg-accent/10 rounded-xl shadow-xl overflow-hidden relative max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-white text-[20px]">{title}</CardTitle>
            <CardDescription className="text-white text-[12,5px]">
              {description}
            </CardDescription>
          </CardHeader>
          <CardContent className="">{children}</CardContent>
        </Card>
      </main>
  );
}
