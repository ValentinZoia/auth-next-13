import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NotificationProvider } from "@/context/NotificationContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Auth Next 13",
  description: "Sistema de autenticación con Next 13",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <NotificationProvider>
        <body className={inter.className}>{children}</body>
      </NotificationProvider>
      
    </html>
  );
}
