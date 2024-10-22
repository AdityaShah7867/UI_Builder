'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import localFont from "next/font/local";
import "./globals.css";
import Script from 'next/script';  // Import Script to handle script injections

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function RootLayout({ children }) {
  const router = useRouter();

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   if (!token) {
  //     router.push('/auth/login');
  //   }
  // }, [router]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-black`}
      >





        {children}
      </body>
    </html>
  );
}
