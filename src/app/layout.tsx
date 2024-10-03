import type { Metadata } from "next";
import Header from "@/components/header/Header";
import './globals.css'

export const metadata: Metadata = {
  title: "Pixel Ecommerce",
  description: "Allow others to sell their rpoduct",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
