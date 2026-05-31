// Layout raiz que definindo a estrutura HTML

import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { CartProvider } from "@/providers/CartProvider";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const geistMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Loja UNIFOR - Produtos Acadêmicos Personalizados",
  description:
    "Plataforma de e-commerce da UNIFOR para estudantes e funcionários comprarem produtos acadêmicos personalizados.",
  icons: {
    icon: "/U.png",
    apple: "/U.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="bg-background">
      <body
        className={`${inter.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <CartProvider>{children}</CartProvider>
        <Toaster position="top-right" offset={80} />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
