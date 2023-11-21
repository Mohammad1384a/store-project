"use client";
import { useState } from "react";
import { Inter } from "next/font/google";
import "../global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";
import Header from "../(user)/header";

const inter = Inter({ subsets: ["latin"] });

function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <CookiesProvider defaultSetOptions={{ path: "/" }}>
          <QueryClientProvider client={queryClient}>
            <Header />
            {children}
          </QueryClientProvider>
        </CookiesProvider>
      </body>
    </html>
  );
}

export default RootLayout;
