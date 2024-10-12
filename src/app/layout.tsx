import type { Metadata } from "next";
import Header from "@/components/header/Header";
import "./globals.css";
import ReduxProvider from "@/redux/reducer";
import CartLoader from "@/components/products/cartLoader";
import { refreshAuthentication } from "@/redux/slices/user";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import PageRenderLoad from "@/components/utils/pageRenderLoad";

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
          <PageRenderLoad>
          <Header />
          {children}
          </PageRenderLoad>
          <div className="mb-6"></div>
        </ReduxProvider>
      </body>
    </html>
  );
}
