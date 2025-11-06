import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Repo Remover",
    template: "%s | Repo Remover",
  },
  description: "GitHub 레포지토리를 쉽고 빠르게 관리하세요. 대량 삭제, 정리, 최적화를 한 번에.",
  keywords: ["GitHub", "repository", "manager", "cleanup", "delete", "bulk"],
  authors: [{ name: "Repo Remover" }],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://repo-remover.vercel.app",
    title: "Repo Remover",
    description: "GitHub 레포지토리를 쉽고 빠르게 관리하세요.",
    siteName: "Repo Remover",
  },
  twitter: {
    card: "summary_large_image",
    title: "Repo Remover",
    description: "GitHub 레포지토리를 쉽고 빠르게 관리하세요.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
