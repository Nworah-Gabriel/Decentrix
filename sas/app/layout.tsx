import type React from "react";
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";
import Provider from "@/components/Provider";

export const metadata: Metadata = {
  title: "SAS - Sui Attestation Service",
  description: "Decentralized attestation service on Sui blockchain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-background">
              <Header />
              <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
              <Footer />
            </div>
          </ThemeProvider>
        </Provider>
      </body>
    </html>
  );
}
