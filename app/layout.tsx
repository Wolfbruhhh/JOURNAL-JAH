import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "JAH Journal | Protect the process",
  description: "Your trades. Your process. Your edge. A personal trading journal for Jah.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
