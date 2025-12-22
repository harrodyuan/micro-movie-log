import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Moving Image Data Base",
  description: "A minimalist log of movies and moving images",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-black">
        <Navbar />
        <div className="pt-14">
          {children}
        </div>
      </body>
    </html>
  );
}
