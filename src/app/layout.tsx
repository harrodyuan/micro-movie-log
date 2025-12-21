import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
