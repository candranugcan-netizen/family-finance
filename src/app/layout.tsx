import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/query-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Family Financial Management",
  description: "Secure and structured family finance tracking.",
  manifest: "/manifest.json", // Persiapan untuk PWA nanti
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Penting untuk UX PWA (mencegah zoom tak sengaja di mobile)
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <QueryProvider>
          <main className="min-h-screen mx-auto max-w-md bg-white shadow-sm overflow-x-hidden relative">
            {/* Kita batasi max-w-md untuk memaksakan desain Mobile-First */}
            {children}
          </main>
        </QueryProvider>
      </body>
    </html>
  );
}