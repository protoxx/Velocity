import "./globals.css";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { getSiteShellData } from "@/lib/site-service";

export const metadata = {
  title: "Velocity Web",
  description: "Front Velocity pour sites locaux",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const shellData = await getSiteShellData();

  return (
    <html lang="fr">
      <body className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-100 text-zinc-900">
        <div className="flex min-h-screen flex-col">
          <SiteHeader
            brandName={shellData.settings?.brandName}
            navigation={shellData.navigation}
            phone={shellData.settings?.phone}
            contactEmail={shellData.settings?.contactEmail}
          />
          <div className="flex-1">{children}</div>
          <SiteFooter settings={shellData.settings} />
        </div>
      </body>
    </html>
  );
}
