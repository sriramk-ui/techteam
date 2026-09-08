import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import HelloPreloader from "@/components/atoms/HelloPreloader";

export const metadata: Metadata = {
  title: "Innovation Collaboration | We Build, We Compete, We Deliver",
  description: "A dual-mode portfolio and internal management platform. Explore our projects, events, and team members.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <HelloPreloader />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
