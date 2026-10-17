import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "../components/layout/Navbar";
import { AuthProvider } from "../lib/auth/AuthContext";
import AuthModal from "../components/auth/AuthModal";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "PetPal",
  description: "Welcome to PetPal.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-screen flex-col">
        <AuthProvider>
          <Suspense
            fallback={
              <div className="h-[81px] border-b border-gray-100 bg-white" />
            }>
            <Navbar />
          </Suspense>

          {children}

          <Suspense fallback={null}>
            <AuthModal />
          </Suspense>
        </AuthProvider>
      </body>
    </html>
  );
}
