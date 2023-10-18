"use client";
import { useState } from "react";
import { Inter } from "next/font/google";
import Header from "./header";
import "./global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const inter = Inter({ subsets: ["latin"] });

function RootLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <Header />
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}

export default RootLayout;
