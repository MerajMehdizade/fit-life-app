import type { Metadata } from "next";
import "./globals.css";
import { UserProvider } from "./context/UserContext";

export const metadata: Metadata = {
  title: "FitScope",
  description: "Success With FitScope",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" dir="rtl">
      <body
        className="font-yekanBakhRegular antialiased bg-gray-950"
      >
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
