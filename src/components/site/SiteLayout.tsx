import type { ReactNode } from "react";
import { LangProvider } from "@/lib/lang-context";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { WhatsAppFab } from "./WhatsAppFab";

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <LangProvider>
      <div className="min-h-screen bg-background">
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFab />
      </div>
    </LangProvider>
  );
}
