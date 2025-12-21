import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Micro-Movie Log",
  description: "A minimalist log of movies watched in theater",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
