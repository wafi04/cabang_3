import type { Metadata } from "next";
import "./globals.css";
import { ReactQueryProvider } from "@/features/providers/reactQuery";
import { Toaster } from "react-hot-toast";
import { MetadataService } from "@/lib/metadata";
import { DynamicFavicon } from "@/components/ui/DynamicFavicon";
import { ContactPerson } from "@/components/ui/ContactPerson";

export async function generateMetadata(): Promise<Metadata> {
  return await MetadataService.generateBaseMetadata();
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await MetadataService.fetchWebSettings();

  return (
    <html lang="en">
      <DynamicFavicon />
      <body>
        <ReactQueryProvider>
          {data?.url_whatsapp && (
            <ContactPerson nowa={data?.whatsapp_number as string} />
          )}
          {children}
          <Toaster />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
