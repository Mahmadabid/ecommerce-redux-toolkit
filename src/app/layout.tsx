import type { Metadata } from "next";
import Header from "@/components/header/Header";
import "./globals.css";
import ReduxProvider from "@/redux/reducer";
import CartLoader from "@/components/products/cartLoader";

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
        <ReduxProvider>
          <CartLoader />
          <Header />
          {children}
          <div className="mb-6"></div>
        </ReduxProvider>
      </body>
    </html>
  );
}
